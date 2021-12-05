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

    
    let { i, x, y, rot, scale, trans, cards, bind, objs, origin } = this.props;
    if (objs.length != 0){
      console.log('made it');
    let { name, price, distance, image_url, url, rating, location, categories} = objs[i];
    rating = rating.toFixed(1)

    let new_name = name.replace(/ /g, '+');
    
    let destination = new_name + "+" + location['city'] + location['state']

    let google_url = 'https://www.google.com/maps/dir/?api=1&origin=' + origin + '&destination=' + destination
    
    let dist = distance * 0.000621371192;
    dist = dist.toFixed(2)
    let tags = ''

    categories.forEach((item, idx, categories) => {
      tags += item['title']
      if (idx != categories.length - 1){
       tags += ', '
      }
    })
   

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
              
                <img src={image_url} alt="profilePicture" />
              
            </Carousel>
            <h3>{rating}⭐️</h3>
            <h2>{name}, {price}</h2>
            <h5>{dist} miles away | {location['address1']}</h5>
            <h4>{tags}</h4>
            
            <a href={google_url}>
              <button class="button">📍 Directions </button>
            </a>
            <a href={url}>
              <button class="button">🌐 Website </button>
            </a>
            
           
            
          </div>
        </animated.div>
      </animated.div>
    );
  }
  else {
    return null;
  }
}
}

export default Card;

