import React, { Component } from 'react'
import '../styles/SearchBar.css'

export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = {
            userData: null,
            searchHistory: []
        };        
        this.searhProfile = this.searhProfile.bind(this);
        this.addRow = this.addRow.bind(this);
        
    }
    componentDidMount() {

        const getHistory = "http://localhost:8090/user/history";
        fetch(getHistory)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.length > 0) {                    
                    data.map(element => this.addRow(element));
                    // document.getElementById("remove-history").addEventListener("click", 
                    //     function () {
                    //          alert(this.parentNode.className); 
                    // });

                }
            })
    }
    searhProfile() {
        let profileName = document.getElementById('search-profile').value;
        const getGitProfileURL = "https://api.github.com/users/"+profileName;
        const saveGitProfileURL = "http://localhost:8090/user/save";
        fetch(getGitProfileURL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.hasOwnProperty('message')) {
                    this.setState({ userData: "Handle "+data.message });
                    console.log(data.message)
                }                
                else {
                this.setState({ userData: data });
                fetch(saveGitProfileURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.state.userData)
                })
                .then(response => console.log(response.json()));  
                }               
            });
    }
    
    addRow = (handle) => { 
        document.querySelector('#add-history').insertAdjacentHTML(
            'afterbegin',
            `<button class="add-history ` + handle + `">`+ handle +`<span id="remove-history" class="remove-icon">x</span></button>`
        )
    }

    removeRow(input) {
        input.parentNode.remove()
    }

    render() {
        return (
            <div>
                <div className="wrap">
                    <h3>Search a git profile</h3>
                    <div className="search">                        
                        <input id="search-profile" type="text" className="searchTerm" placeholder="Git Profile"/>
                        <button type="submit" className="searchButton" onClick={this.searhProfile}>
                            Search
                        </button>
                    </div>
                    <div id="add-history">
                    </div>
                    <div className="json-data">
                        {this.state.userData ? JSON.stringify(this.state.userData, null, 2):null}
                    </div>
                </div>
            </div>
        )
    }
}
