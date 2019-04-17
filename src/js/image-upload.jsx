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
    render() {
        return(
            <ImageUploadDiv>
                <div className="upload-dropzone">
                    Перетащите файлы сюда или нажмите чтобы открылась форма, короче
                </div>

                <div className="upload-filelist">
                    <div className="upload-thumbnail">
                        <img src="content/listpic00.jpg"/>
                        <div>Screenshot 2019-01-22 at 01.36.48.png</div>
                    </div>
                    <div className="upload-thumbnail">
                        <img src="content/listpic00.jpg"/>
                        <div>Screenshot 2019-01-22 at 01.36.48.png</div>
                    </div>
                    <div className="upload-thumbnail">
                        <img src="content/listpic00.jpg"/>
                        <div>Screenshot 2019-01-22 at 01.36.48.png</div>
                    </div>
                    <div className="upload-thumbnail">
                        <img src="content/listpic00.jpg"/>
                        <div>Screenshot 2019-01-22 at 01.36.48.png</div>
                    </div>
                    <div className="upload-thumbnail">
                        <img src="content/listpic00.jpg"/>
                        <div>Screenshot 2019-01-22 at 01.36.48.png</div>
                    </div>
                    <div className="upload-thumbnail">
                        <img src="content/listpic00.jpg"/>
                        <div>Screenshot 2019-01-22 at 01.36.48.png</div>
                    </div>
                </div>

                <div className="upload-controls">
                    <button>Загрузить</button>
                </div>
            </ImageUploadDiv>
        );
    }
}

ReactDOM.render(<ImageUploadForm/>, document.querySelector('#image-upload-form'));
