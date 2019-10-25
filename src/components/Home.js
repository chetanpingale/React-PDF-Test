import React from 'react';
import { hot } from 'react-hot-loader';
import { Document, Page } from 'react-pdf';
import style from './Home.scss';

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfList: [],
      numPages: null,
      pageNumber: 1,
    };
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
  }

  onDocumentLoadSuccess({ numPages }) {
    this.setState({ numPages });
  }

  setSelectedPdf(selectedIndex) {
    const pdfData = this.state.pdfList;
    pdfData.forEach((pdf, index) => {
      // eslint-disable-next-line no-param-reassign
      pdf.isSelected = index === selectedIndex;
    });
    this.setState({ pdfList: pdfData });
  }

  handleUploadClick(selectorFiles) {
    const pdfDetails = selectorFiles[0];
    const { pdfList } = this.state;
    pdfDetails.isSelected = pdfList.length === 0;
    const pdfData = pdfList;
    pdfData.push(pdfDetails);
    this.setState({ pdfList: pdfData });
  }

  handleButtonClick() {
    document.getElementById('react-file-upload').click();
  }

  render() {
    const { pdfList, numPages, pageNumber } = this.state;
    let selectedPDFDetails = null;
    pdfList.forEach(pdf => {
      if (pdf.isSelected) {
        selectedPDFDetails = pdf;
      }
    });
    return (
      <div className={style.frame}>
        <div className={style.left_bar}>
          <div className={style.logo_sm_white} />
          <div className={style.files}>files</div>

          {pdfList.map((pdf, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div
              key={index}
              className={`${
                pdf.isSelected
                  ? style.left_menu_button_active
                  : style.left_menu_button
              }`}
              style={{ top: `${index * 120 + 300}px` }}
              onClick={() => this.setSelectedPdf(index)}
            >
              <div
                className={`${
                  pdf.isSelected
                    ? style.left_menu_button_icon
                    : style.left_menu_button_default_icon
                }`}
              />
              <div
                className={`${
                  pdf.isSelected
                    ? style.left_menu_button_title
                    : style.left_menu_button_default_title
                }`}
              >
                {pdf.name}
              </div>
            </div>
          ))}

          <div
            className={style.upload_files_button}
            onClick={this.handleButtonClick}
          >
            <div className={style.upload_files_button_title}>Upload Files</div>
            <div className={style.upload_files_button_icon} />
          </div>
          <input
            className={style.upload_button}
            id="react-file-upload"
            type="file"
            onChange={e => this.handleUploadClick(e.target.files)}
            accept="application/msword, text/plain, application/pdf"
          />
        </div>

        {selectedPDFDetails && selectedPDFDetails.name ? (
          <div className={style.right_bar}>
            <div className={style.selected_document_icon} />
            <div className={style.selected_document_title}>
              {selectedPDFDetails.name}
            </div>
            <div className={style.pdf_container}>
              <Document
                file={selectedPDFDetails}
                onLoadSuccess={this.onDocumentLoadSuccess}
                options={options}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default hot(module)(App);
