import React, { PureComponent } from "react";
import reactCSS from "reactcss";
import { connect } from "react-redux";

class ProgressBar extends PureComponent {
  render() {
    const deckLength = this.props.cards.length + this.props.masteredCardNum;
    const slotLength = Math.round(100 / deckLength);
    const greenWidth = slotLength * this.props.masteredCardNum + "%";
    const styles = reactCSS({
      default: {
        progressBar: {
          border: "1px solid #ccc",
          borderRadius: 2,
          width: "90%",
          margin: "auto",
          marginTop: 15,
          position: "relative",
          textAlign: "left",
          height: 25
        },
        green: {
          backgroundColor: "#02ddba",
          borderRadius: 2,
          width: greenWidth,
          position: "relative",
          float: "left",
          height: 25
        }
      }
    });
    return (
      <div style={styles.progressBar}>
        <span style={styles.green} />
      </div>
    );
  }
}

export default connect(storeState => ({
  cards: storeState.cards,
  masteredCardNum: storeState.masteredCardNum
}))(ProgressBar);
