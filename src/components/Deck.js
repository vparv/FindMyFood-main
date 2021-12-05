import React, { useEffect, useState } from "react";
import { useSprings } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";
import Card from "./Card";
import axios from 'axios'

import "../styles/Deck.css";

let objs = []

let origin = '401 Thompson St, Ann Arbor, MI'
origin=origin.replace(/ /g,"+");
origin=origin.replace(/,/g,"+");

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

  let [objs, setObjs] = useState([])

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
const upper_limit = 15


let liked_res = []

useEffect(() => {
  axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search`, {
     headers: {
         Authorization: `Bearer 3B2xGiOH68R8v1OL4CRB3swuq0WXXlJ9Ut2I-NIxtGSnX4VwbrsR5TzbbLoIh2Xr3prTG7IikYerAUFJdJ1cgn2uwVLDu-j6yTo74Dsw8Bi3IGovyg6dxv86iWJ8YXYx`
     },
     params: {
         'radius': '8000',
         'location': origin
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
     objs = array
     console.log('obj', objs)
     setObjs(array)
     
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
      origin={origin}
    />
  ));
}

export default Deck;
