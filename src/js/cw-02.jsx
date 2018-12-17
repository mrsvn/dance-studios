
import React from "react";
import ReactDOM from "react-dom";

class Priv extends React.Component {
    render() {
        return (
            <h1>Hello, {this.props.x}</h1>
        );
    }
}

class Main extends React.Component {
    render() {
        return (
            <div>
                <Priv x={"one"}/>
                <Priv x={"two"}/>
                <Priv x={"three"}/>
            </div>
        )
    }
}

class PwdField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ""
        };
    }

    handleInput(e) {
        this.setState({
            value: e.target.value
        });
    }

    getBackground() {
        if (this.state.value.length <= 7) {
            return "red";
        }
        else {
            if(this.state.value.length <= 12) {
                return "yellow";
            }
            else {
                return "green";
            }
        }
    }

    render() {
        return (
            <input value={this.state.value}
                   onInput={e => this.handleInput(e)}
                   style={{
                       background: this.getBackground()
                   }}
            />
        )
    }
}

class FilterableList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: ""
        };
    }

    handleQueryChange(newQuery) {
        this.setState({
            query: newQuery
        })
    }

    render() {
        const selectedItems =[];

        this.props.allItems.forEach(item => {
            if (item.toLowerCase().includes(this.state.query.toLowerCase())) {
                selectedItems.push(item);
            }
        });

        return (
            <div>
                <p>
                    <SearchField onNewSearchQuery={x => this.handleQueryChange(x)} />
                </p>
                <p>
                    <ItemsList items={selectedItems} />
                </p>
            </div>
        );
    }
}

class ItemsList extends React.Component {
    render() {
        const listItems = [];

        this.props.items.forEach(item => {
            listItems.push(
                <li>{item}</li>
            );
        });

        return (
            <ul>
                { listItems }
            </ul>
        )
    }
}

class SearchField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ""
        };
    }

    handleInput(e) {
        this.setState({
            value: e.target.value
        });

        // this.props.onNewSearchQuery(e.target.value);
    }

    handleClick(){
        this.props.onNewSearchQuery(this.state.value);
    }

    render() {
        return (
            <p>
                <input value={this.state.value} onInput={e => this.handleInput(e)} />
                <button onClick={() => this.handleClick()}>Search</button>
            </p>
        );
    }
}

window.addEventListener('load', () => {
    const items = [
        "Swizz Beatz",
        "Russ",
        "Meek Mill",
        "Logic",
        "Lil Wayne",
        "Lil Uzi Vert",
        "Birdman",
        "Travis Scott",
        "Chance the Rapper",
        "Eminem",
        "Migos",
        "DJ Khaled",
        "Kanye West",
        "Future",
        "Pitbull",
        "Nas",
        "Dr. Dre",
        "J. Cole",
        "Drake",
        "Kendrick Lamar",
        "Diddy",
        "Jay-Z"
    ];

    ReactDOM.render(<FilterableList allItems={items} />, document.querySelector('main'));
});
