import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import { getFirestore } from 'redux-firestore';

class WireframeLinks extends React.Component {

    handleOnClick = (id) => { // order - push list to top
        const fireStore = getFirestore();
        fireStore.collection("wireframes").doc(id).update( {
            time : new Date().getTime()
        });
    }

    render() {
        const wireframes = this.props.wireframes;
        //console.log(wireframes);
        const user = this.props.auth.uid;
        //this.props.wireframes.filter(frame => frame.owner == this.props.auth.uid);
        // only show links to wireframes user owns. filter owner
        return (
            <div className="todo-lists section"> 
                {wireframes && wireframes.filter(frame => frame.owner == user).map(wireframe => (
                    <Link to={'/wireframe/' + wireframe.id} key={wireframe.id} 
                        onClick={() => this.handleOnClick(wireframe.id)} >
                        <WireframeCard wireframe={wireframe} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(WireframeLinks);