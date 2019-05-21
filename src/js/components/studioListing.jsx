import React from "react";

import { Link } from "react-router-dom";
import { cityById } from "../util/cities";

class StudioListing extends React.Component {
    render() {
        const content = this.props.content;

        let tag_links = [];

        content.tags.forEach(tag => {
            tag_links.push(<React.Fragment key={tag}>
                <a href='#'>{tag}</a>
                &nbsp;
            </React.Fragment>);
        });

        return (
            <div className={'posting'}>
                <div className={'p-thumbnail'}>
                    <img src={content.imgUrl}>
                    </img>
                </div>
                <div className={'p-body'}>
                    <div className={'p-details'}>
                        <h3 className={'p-title'}>{ content.title }</h3>

                        <div className={'p-tags'}>
                            <p>{ tag_links }</p>
                        </div>
                        <div className={'p-row'}>
                            <b>Расположение:</b> <span> { cityById(content.city).districtNameById(content.district) } </span>
                        </div>
                        <div className={'p-description'}>
                            <p>{ content.description }</p>
                        </div>
                    </div>
                    <div className={ 'p-link' }>
                        <Link to={`/studios/${ content.urlBit}`}>Подробнее &rarr;</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export { StudioListing };
