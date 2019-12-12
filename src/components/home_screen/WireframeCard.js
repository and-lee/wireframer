import React from 'react';
import { Link } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';

class WireframeCard extends React.Component {

    handleDelete = (e) => {
        console.log("Deleted Wireframe: "+this.props.wireframe.id);
        e.preventDefault();
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

                <div className="col s2 delete_card_button" >
                    <i className="medium material-icons" onClick={e=>this.handleDelete(e)}>clear</i>
                    </div>

            </div>
        );
    }
}
export default WireframeCard;