import React, {useState, useEffect} from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';


function BarGraph(props) {

    const [months, setMonths] = useState ([
        {id: 1, label: 'Jan', count: 0},
        {id: 2, label: 'Feb', count: 0},
        {id: 3, label: 'Mar', count: 0},
        {id: 4, label: 'Apr', count: 0},
        {id: 5, label: 'May', count: 0},
        {id: 6, label: 'Jun', count: 0},
        {id: 7, label: 'Jul', count: 0},
        {id: 8, label: 'Aug', count: 0},
        {id: 9, label: 'Sep', count: 0},
        {id: 10, label: 'Oct', count: 0},
        {id: 11, label: 'Nov', count: 0},
        {id: 12, label: 'Dec', count: 0}
    ]);

    useEffect(() => {
        const client = new ApolloClient({
            uri: 'https://fakerql.stephix.uk/graphql',
            cache: new InMemoryCache()
          });
          
          client
            .query({
              query: gql`
                query GetPosts {
                  allPosts(count: 18) {
                    createdAt
                  }
                }
              `
            })
            .then(result => {
              const newArr = [...months];
              console.log(result);
              let postsInfo = result.data.allPosts.map(post => parseInt(post.createdAt)); 
              let arrayOfDates = postsInfo.map(item => new Date(item));
              let yearBasedArray = [];
              for(let i = 0; i < arrayOfDates.length; i++){
                if (arrayOfDates[i].toLocaleString("en-US", {year: "numeric"}) == 2019) {       
                  yearBasedArray.push(parseInt(arrayOfDates[i].toLocaleString("en-US", {month: "numeric"})));      
                }       
              }
          
              yearBasedArray.map(item => {
                  let find = newArr.find(x => x.id === item);
                  let idx = newArr.indexOf(find);
                  return newArr[idx].count++;
                  
              });
              setMonths(newArr);
            }          
            );
      }, []);

      const data = months;
      console.log('this is what the chart gets',data);
      
      const width = 500;
      const height = 500;
      const margin = { top: 20, bottom: 20, left: 20, right: 20 };
      
      const xMax = width - margin.left - margin.right;
      const yMax = height - margin.top - margin.bottom;

      const x = d => d.label;
      const y = d => +d.count;

      const xScale = scaleBand({
        range: [0, xMax],
        round: true,
        domain: data.map(x),
        padding: 0.4,
      });
      const yScale = scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(y))],
      });
      
      const compose = (scale, accessor) => data => scale(accessor(data));
      const xPoint = compose(xScale, x);
      const yPoint = compose(yScale, y);

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const barHeight = yMax - yPoint(d);
        return (
          <Group key={`bar-${i}`}>
            <Bar
              x={xPoint(d)}
              y={yMax - barHeight}
              height={barHeight}
              width={xScale.bandwidth()}
              fill="#fc2e1c"
            />
          </Group>
        );
      })}
    </svg>
  );
}

export default BarGraph;
