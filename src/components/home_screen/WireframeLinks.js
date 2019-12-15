import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';

class WireframeLinks extends React.Component {

    render() {
        const wireframes = this.props.wireframes;
        //console.log(wireframes);
        const user = this.props.auth.uid;
        //this.props.wireframes.filter(frame => frame.owner == this.props.auth.uid);
        // only show links to wireframes user owns. filter owner
        return (
            <div className="todo-lists section"> 
                {wireframes && wireframes.filter(frame => frame.owner == user).map(wireframe => (
                    <WireframeCard wireframe={wireframe} />
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