import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks';
import { getFirestore } from 'redux-firestore';

class HomeScreen extends Component {

    /*newKey() {
        const fireStore = getFirestore();
        
        let test = this.props.wireframes;

        fireStore.collection("wireframes").get().then(function(querySnapshot) {
            let test = querySnapshot;
            console.log(test);
            let len = (querySnapshot.size);
            for(let i=0; i<len; i++) {
                if(test.docs.find(function(frame){return frame.key==i})==null) {
                    return i;
                }
            }
            return len;
        });
    }*/

    handleNewList = () => {
        let time = new Date().getTime();

        const fireStore = getFirestore();
        fireStore.collection('wireframes').add({
            //key: this.newKey(),
            name: "",
            owner: this.props.auth.uid, // current user.id
            height: 500,
            width: 500,
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
    const {wireframes} = state.firestore.data;
    return {
        wireframes,
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'wireframes', orderBy: ['time', 'desc']},
    ]),
)(HomeScreen);