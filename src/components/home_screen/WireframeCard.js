import React from 'react';
import { Link } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';
import Modal from 'react-materialize/lib/Modal';

class WireframeCard extends React.Component {

    handleDelete = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').doc(this.props.wireframe.id).delete();
        console.log("Deleted Wireframe: "+this.props.wireframe.id);
    }

    handleOnClick = (id) => { // order - push list to top
        const fireStore = getFirestore();
        fireStore.collection("wireframes").doc(id).update( {
            time : new Date().getTime()
        });
    }

    render() {
        const { wireframe } = this.props;
        console.log("WireframeCard, wireframe.id: " + wireframe.id);
        return (
            <div className="row link_card_container">

                <div className="col s10 link_card">
                    <Link to={'/wireframe/' + wireframe.id}
                        onClick={() => this.handleOnClick(wireframe.id)} >
                        <div className="card z-depth-1 todo-list-link light-green lighten-3">
                            <div className="card-content grey-text text-darken-3">
                                <span className="card-title">{wireframe.name}</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col s2 link_card" >
                    <Modal className="delete_modal" header="Delete Wireframe"
                        trigger={<i className="card_button material-icons">clear</i>}
                        options={{dismissible: false}}
                        actions={
                            <div>
                                <button className="btn waves-effect waves-light z-depth-0" onClick={this.handleDelete}>Yes</button>
                                &nbsp;
                                <button className="btn waves-effect waves-light grey lighten-1 z-depth-0 modal-close">No</button>
                            </div>
                        }>
                            <p> Are you sure you want to delete this diagram? </p>
                            <div>The diagram will not be retreivable.</div>
                    </Modal>


                </div>

            </div>
        );
    }
}
export default WireframeCard;