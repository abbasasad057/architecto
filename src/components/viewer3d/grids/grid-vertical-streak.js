import * as Three from 'three';
import { List } from 'immutable';
import { COLORS } from '../../../shared-style';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export default function (width, height, grid, font) {
  let step = grid.properties.get('step');
  let colors = grid.properties.has('color') ? new List([grid.properties.get('color')]) : grid.properties.get('colors');

  let streak = new Three.Object3D();
  streak.name = 'streak';

  let counter = 0;

  for (let i = 0; i <= width; i += step) {

    let geometry = new THREE.BufferGeometry();
    geometry.vertices.push(new Three.Vector3(i, 0, 0));
    geometry.vertices.push(new Three.Vector3(i, 0, -height));

    
    const vertices = new Float32Array([
      i, 0, 0,
      i, 0, -height,
    ]);

    const indices = new Uint16Array([
      0, 1, 2
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    let color = colors.get(counter % colors.size);
    let material = new Three.LineBasicMaterial({ color });

    if (counter % 5 == 0) {
      let shape = new TextGeometry(('' + (counter * step)), {
        size: 16,
        height: 1,
        font: font
      });

      let wrapper = new Three.MeshBasicMaterial({ color: COLORS.black });
      let words = new Three.Mesh(shape, wrapper);

      words.rotation.x -= Math.PI / 2;
      words.position.set(i - 20, 0, 50);
      streak.add(words);
    }

    streak.add(new Three.LineSegments(geometry, material));
    counter++;
  }
  return streak;
}
