import React from "react";

class StudioListing extends React.Component {
    render() {
        const content = this.props.content;

        let tag_links = [];

        content.tags.forEach(tag => {
            tag_links.push(<>
                <a href='#'>{tag}</a>
                &nbsp;
            </>);
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
                            <b>Расположение:</b> <span> { content.district } </span>
                        </div>
                        <div className={'p-description'}>
                            <p>{ content.description }</p>
                        </div>
                    </div>
                    <div className={ 'p-link' }>
                        <a href={`/studio/${ content.urlBit}`}>Подробнее &rarr;</a>
                    </div>
                </div>
            </div>
        );
    }
}

export { StudioListing };
