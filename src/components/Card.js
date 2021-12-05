import React from "react";
import { animated, interpolate } from "react-spring/hooks";
import Carousel from "nuka-carousel";

class Card extends React.Component {
  state = {
    count: 0
  }

  increments = () => {
    let newCount = this.state.count + 1;
    this.setState({
      count: newCount
    })
  }

  render() {
    let { i, x, y, rot, scale, trans, cards, bind, objs } = this.props;
    let { name, age, distance, text, pics, website, directions } = objs[i];

    return (
      <animated.div
        key={i}
        style={{
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}px,${y}px,0)`
          )
        }}
      >
        <animated.div
          {...bind(i)}
          style={{
            transform: interpolate([rot, scale], trans)
          }}
        >
          <div className="card">
            <Carousel>
              {pics.map(pic => (
                <img src={pic} alt="profilePicture" />
              ))}
            </Carousel>
            <h2>{name},</h2>
            <h2>{age}</h2>
            <h5>{distance}</h5>
            <h5>{text}</h5>
            <a href={directions}>
              <button class="button">📍 Directions </button>
            </a>
            <a href={website}>
              <button class="button">🌐 Website </button>
            </a>
            
           
            
          </div>
        </animated.div>
      </animated.div>
    );
  }
}

export default Card;
