import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks'
import { getFirestore } from 'redux-firestore';

class HomeScreen extends Component {

    handleNewList = () => {
        let time = new Date().getTime();

        const fireStore = getFirestore();
        fireStore.collection('wireframes').add({
            name: "",
            owner: this.props.auth.uid, // current user.id
            controls: [],
            time: time,
        }).then(ref => {
            this.props.history.push("/wireframe/" + ref.id);
        });

    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <div className="link_header">Recent Work</div>
                        <WireframeLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            Wireframer™<br />
                            A Wireframe Maker
                        </div>
                        
                        <div className="home_new_list_container">
                                <button className="home_new_list_button waves-effect waves-light btn-large" onClick={this.handleNewList}>
                                    <i className="largeIcon material-icons right">add</i>
                                    Create New Wireframe
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'wireframes', orderBy: ['time', 'desc']},
    ]),
)(HomeScreen);