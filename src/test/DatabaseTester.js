import React from 'react'
import { connect } from 'react-redux';
import testJson from './TestWireframeData.json'
import { getFirestore } from 'redux-firestore';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom'

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        testJson.wireframes.forEach(wireframeJson => {
            fireStore.collection('wireframes').add({
                    name: wireframeJson.name,
                    owner: wireframeJson.owner,
                    width: wireframeJson.width,
                    height: wireframeJson.height,
                    controls: wireframeJson.controls,
                    
                    time: new Date().getTime(),
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        });
    }

    isAdmin = () => {
        if (this.props.users) {
            console.log(this.props.users);
            for(let i =0; i<this.props.users.length; i++) {
                if((this.props.users[i]["admin"]==true) && (this.props.auth.uid==this.props.users[i]["id"])) {
                    return true;
                }
            }
        }
    }

    render() {
        if ( !(this.props.auth && this.isAdmin()) ) { // user is not an Admin
            return <Redirect to="/" />; // get outta here
        }
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        users: state.firestore.ordered.users,
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: "users" },
    ]),
)(DatabaseTester);