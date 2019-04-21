import React from "react";
import ReactDOM from "react-dom";

import styled from 'styled-components';

const ImageUploadDiv = styled.div`
  display: inline-block;
    
  width: 500px;
    
  padding: 2em;
  border: 1px gray solid;
  
  & .upload-dropzone {
    padding: 4em;
    border: 1px darkgray dashed;

    cursor: pointer;

    &.highlighted {
      background: lightblue;
    }
  }
  
  & .upload-filelist {
    display: flex;
    padding: 2em;

    flex-wrap: wrap;

    justify-content: space-between;
  }
  
  & .upload-thumbnail {
    img {
      max-width: 8em;
      max-height: 6em;
    }
    
    div {
      max-width: 8em;
      word-break: break-all;
    }
  }
  
  & .upload-controls {
    text-align: center;
  }
`;

class ImageUploadForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };

        this.fileInput = React.createRef();
    }

    handleDragEnter(e) {
        e.target.classList.add("highlighted");
    }

    handleDragLeave(e) {
        e.target.classList.remove("highlighted");
    }

    handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.classList.remove("highlighted");

        this.setState({
            files: e.dataTransfer.files
        });
    }

    handleDropZoneClick(e) {
        this.fileInput.current.click();
    }

    handleNewFiles(e) {
        this.setState({
            files: [].concat(this.state.files, Array.from(e.target.files))
        });
    }

    handleSubmit() {
        const formData = new FormData();

        this.state.files.forEach(file => {
            formData.append(file.name, file);
        });

        fetch('/upload-images', {
            method: 'POST',
            body: formData
        }).then(function (response) {
            console.log("ok");
        });
    }

    render() {
        return(
            <ImageUploadDiv>
                <div className="upload-dropzone"
                     onDragEnter={e => this.handleDragEnter(e)}
                     onDragLeave={e => this.handleDragLeave(e)}
                     onDrop={e => this.handleDrop(e)}
                     onClick={e => this.handleDropZoneClick(e)}>
                    Перетащите файлы сюда или нажмите чтобы открылась форма, короче
                </div>

                <input type="file" style={{display: 'none'}} multiple ref={this.fileInput} onChange={e => this.handleNewFiles(e)}/>

                <div className="upload-filelist">
                    {
                        this.state.files.map(file => (
                            <div className="upload-thumbnail" key={file.name}>
                                <img src={URL.createObjectURL(file)}/>
                                <div>{file.name}</div>
                            </div>
                        ))
                    }

                </div>

                <div className="upload-controls">
                    <button onClick={() => this.handleSubmit()}>Загрузить</button>
                </div>

            </ImageUploadDiv>
        );
    }
}

ReactDOM.render(<ImageUploadForm/>, document.querySelector('#image-upload-form'));
