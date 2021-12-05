import React, { useEffect, useState } from "react";
import { useSprings } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";
import Card from "./Card";
import axios from 'axios'

import "../styles/Deck.css";

let objs = [
  {
    pics: [
"https://s3-media0.fl.yelpcdn.com/bphoto/Kax_19qwZS5tAHhxs5WUsQ/o.jpg"    ],
    name: "Isalita",
    age: "$$",
    distance: "0.2 miles away",
    text: "Mexican standards served in a rustic space with a festive streetside patio."
  },
  {
    pics: [
"https://media-cdn.tripadvisor.com/media/photo-s/13/d5/67/50/ramen.jpg"    ],
    name: "Tomukun Noodle Bar",
    age: "$$",
    distance: "0.3 miles away",
    text:
      "Upmarket noodle house dishes up udon, ramen & Pan-Asian mains."
  },
  {
    pics: [
      "https://www.piperpartners.com/wp/wp-content/uploads/2014/11/13888662292_08b713c255_b.jpg", 
      "https://fastly.4sqi.net/img/general/600x600/1853578_lAQ5RpWr01ca3wfev9z74WwoYGryQWXKpU80JamBA7U.jpg"],
    name: "Neopapalis",
    age: "$",
    distance: "0 miles away",
    text: "Sleek spot for fired-to-order Neapolitan pizzas with fully customizable toppings."
  },
  {
    pics: [
      "https://advancelocal-adapter-image-uploads.s3.amazonaws.com/expo.advance.net/img/71f1072188/width2048/d69_117.jpeg", 
      "https://i0.wp.com/www.michigandaily.com/wp-content/uploads/2019/10/eaa.BOAA_.Fritas0015.jpg?fit=720%2C480&ssl=1"
    ],
    name: "Frita Batidos",
    age: "$$",
    distance: "0.5 miles away",
    text:
      "Picnic table seating serves colorful cuban street food & tropical cocktails.",
    website: "www.google.com",
    directions: "www.yahoo.com"
  },
  {
    pics: [
      "https://www.zingermanscreamery.com/app/uploads/2019/09/Screen-Shot-2019-09-05-at-5.57.54-PM.png"
    ],
    name: "Zingerman's Deli",
    age: "$$",
    distance: "0.8 miles away",
    text:
      "Locals line up for generous deli sandwiches at this funky, longtime market.",
    website: "https://www.google.com",
    directions: "https://www.yahoo.com"
  }
];

const to = i => ({
  x: 0,
  y: i * -10,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100
});
const from = i => ({ rot: 0, scale: 1.5, y: -1000 });

const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r /
    10}deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  let [gone] = useState(() => new Set());

  let [cards, setCards] = useState([1,2,3,4,5])

  let [liked] = useState(() => new Set());
    
  let [props, set] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i)
  }));

  const search_url = `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search`
const [restaurant, setRestaurant] = useState([]) 

const [results] = useState(() => new Set());
let content = null
// const restaurants = []
const upper_limit = 5


let liked_res = []

useEffect(() => {
  axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search`, {
     headers: {
         Authorization: `Bearer 3B2xGiOH68R8v1OL4CRB3swuq0WXXlJ9Ut2I-NIxtGSnX4VwbrsR5TzbbLoIh2Xr3prTG7IikYerAUFJdJ1cgn2uwVLDu-j6yTo74Dsw8Bi3IGovyg6dxv86iWJ8YXYx`
     },
     params: {
         'radius': '8000',
         'location': '401 Thompson Street, Ann Arbor, MI'
     }
     })
     .then((res) => {
     console.log(res.data)

     for (let i = 0; i < upper_limit; i++) {
         setRestaurant(res.data['businesses'][i])
         console.log(res.data['businesses'][i]['name'])
         results.add(res.data['businesses'][i])
         
     }
     
     console.log(results)
     const array = [...results]
     console.log(array)
     // objs = array
     //console.log('obj', objs)
     
     })
     .catch((err) => {
     console.log ('error')
     console.log(err)
     })
     }, [search_url])

    

  const bind = useGesture(
    ({
      args: [index, i],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity
    }) => {
      const trigger = velocity > 0.2;

      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        console.log(i)
        gone.add(index);
        if (xDir < 0) {
        //  console.log(cards)
        //  deleted_cards.add(index)
        //  objs.splice(index, index)
        //  console.log('spliced ', index)
        //  console.log(objs)
        }
        if (xDir > 0) {
          liked_res.push(5-index)
          console.log(5-index)
        }
      }


      set(i => {
        if (index !== i) {
          return;
        }
        
        const isGone = gone.has(index);

        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0;

        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0);
        
        const scale = down ? 1.1 : 1;
       
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });

      if (gone.size === cards.length) console.log("empty!") // 
      
      if (!down && gone.size === cards.length) {
            console.log('old cards')
            console.log(cards)
            cards = liked_res
            console.log('new cards')
            console.log(cards)
            console.log('new objs')
            console.log(objs)
            setCards(liked_res)
            liked_res = []
            
        setTimeout(() => gone.clear() || set(i => to(i)), 600);
        
      }

      
  
    }
  
  );

  return props.map(({ x, y, rot, scale}, i) => (
    <Card
      i={i}
      x={x}
      y={y}
      rot={rot}
      scale={scale}
      trans={trans}
      cards={cards}
      objs={objs}
      bind={bind}
    />
  ));
}

export default Deck;
