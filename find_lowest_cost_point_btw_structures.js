function find_lowest_cost_point_btw_structures(struct_array, x_min, x_max, y_min, y_max, criteria_max = 3, criteria = 0) {
  console.log('-------------begin iteration-------------');
  if (struct_array.length < 3){
    if (struct_array.length == 0){
      return 'Structures array is empty. Please provide at least 3 structures for this script to work.';
    }
    return 'Need more structures for this script to work. Minimum of 3.';
  }
  // Game.rooms['sim'].createFlag(new RoomPosition(x_min, y_min, 'sim'), makeid(), COLOR_GREEN);
  // Game.rooms['sim'].createFlag(new RoomPosition(x_min, y_max, 'sim'), makeid(), COLOR_GREEN);
  // Game.rooms['sim'].createFlag(new RoomPosition(x_max, y_min, 'sim'), makeid(), COLOR_GREEN);
  // Game.rooms['sim'].createFlag(new RoomPosition(x_max, y_max, 'sim'), makeid(), COLOR_GREEN);

  console.log('source area:', x_min, y_min, x_max, y_max);
  /*
    Create regions inside of the rectangle to calculate the cost for its centers.
  */
  let qua_1 = new RoomPosition(Math.round((x_max - x_min) * 0.25, 0) + x_min, Math.round((y_max - y_min) * 0.25, 0) + y_min, 'sim');
  let qua_2 = new RoomPosition(Math.round((x_max - x_min) * 0.75, 0) + x_min, Math.round((y_max - y_min) * 0.25, 0) + y_min, 'sim');
  let qua_3 = new RoomPosition(Math.round((x_max - x_min) * 0.25, 0) + x_min, Math.round((y_max - y_min) * 0.75, 0) + y_min, 'sim');
  let qua_4 = new RoomPosition(Math.round((x_max - x_min) * 0.75, 0) + x_min, Math.round((y_max - y_min) * 0.75, 0) + y_min, 'sim');
  console.log('quadrant position [', qua_1, qua_2, qua_3, qua_4, ']');

  let dist_1 = 0;
  let dist_2 = 0;
  let dist_3 = 0;
  let dist_4 = 0;

  /*
    Get the structures inside the array and calculate its move cost
    for every structure to every region center and sums.
  */
  for (let struct of struct_array) {
    let path_1 = PathFinder.search(qua_1, {pos: struct.pos, range: 1});
    let path_2 = PathFinder.search(qua_2, {pos: struct.pos, range: 1});
    let path_3 = PathFinder.search(qua_3, {pos: struct.pos, range: 1});
    let path_4 = PathFinder.search(qua_4, {pos: struct.pos, range: 1});
    /*
      if the region center is inside a wall or its surrounded it will add a
      cost of 999.
    */
    if (path_1.incomplete) {
      dist_1 += 999;
    } else {
      dist_1 += path_1.cost;
    }
    if (path_2.incomplete) {
      dist_2 += 999;
    } else {
      dist_2 += path_2.cost;
    }
    if (path_3.incomplete) {
      dist_3 += 999;
    } else {
      dist_3 += path_3.cost;
    }
    if (path_4.incomplete) {
      dist_4 += 999;
    } else {
      dist_4 += path_4.cost;
    }
  }

  /*
    Create a Map with the cost calculations.
    Calculation with the same results will be overwriten.
  */
  let dist_map = new Map()
    .set(dist_1, 'qua_1')
    .set(dist_2, 'qua_2')
    .set(dist_3, 'qua_3')
    .set(dist_4, 'qua_4');

  /*
    Sort Map from lowest to heighest.
  */
  dist_map = new Map([...dist_map.entries()].sort((a, b) => {return a[0] - b[0]}));

  console.log('quadrant cost [', dist_1, dist_2, dist_3, dist_4, ']');
  console.log(dist_map.keys().next().value);
  console.log(dist_map.values().next().value);
  /*
    Store the result
  */
  let qua_result = dist_map.values().next().value;
  let qua_retorna;
  let new_x_min = 0;
  let new_x_max = 0;
  let new_y_min = 0;
  let new_y_max = 0;
  /*
    Generate the new borders to the next iteration
  */
  if (qua_result == 'qua_1') {
    new_x_min = x_min;
    new_x_max = x_min + Math.round((x_max - x_min)/2, 0);
    new_y_min = y_min;
    new_y_max = y_min + Math.round((y_max - y_min)/2, 0);
    qua_retorna = qua_1;
    Game.rooms['sim'].createFlag(qua_1);
  } else if (qua_result == 'qua_2') {
    new_x_min = x_min + Math.round((x_max - x_min)/2, 0);
    new_x_max = x_max;
    new_y_min = y_min;
    new_y_max = y_min + Math.round((y_max - y_min)/2, 0);
    qua_retorna = qua_2;
    Game.rooms['sim'].createFlag(qua_2);
  } else if (qua_result == 'qua_3') {
    new_x_min = x_min;
    new_x_max = x_min + Math.round((x_max - x_min)/2, 0);
    new_y_min = y_min + Math.round((y_max - y_min)/2, 0);
    new_y_max = y_max;
    qua_retorna = qua_3;
    Game.rooms['sim'].createFlag(qua_3);
  } else {
    new_x_min = x_min + Math.round((x_max - x_min)/2, 0);
    new_x_max = x_max;
    new_y_min = y_min + Math.round((y_max - y_min)/2, 0);
    new_y_max = y_max;
    qua_retorna = qua_4;
    Game.rooms['sim'].createFlag(qua_4);
  }
  console.log(new_x_min, new_y_min, new_x_max, new_y_max);
  var x_res = new_x_max - new_x_min;
  var y_res = new_y_max - new_y_min;
  /*
    Run next iteration if passes the criterias
  */
  if ((x_res <= 2) || (y_res <= 2) || (criteria >= criteria_max)) {
    console.log('bitch please ' + criteria);
    return qua_retorna;
  } else {
    criteria++;
    return find_lowest_cost_point_btw_structures(struct_array, new_x_min, new_x_max, new_y_min, new_y_max, criteria_max, criteria);
  }
}
