import cssauron from 'cssauron';

let select = cssauron({
  tag: node => (node.isMesh && node.geometry.type) || node.type,
  parent: 'parent',
  children: 'children',
  class: node => node.userData.className || '',
  attr : node => attr => node.hasOwnProperty(attr) ? node[attr] : node.userData[attr]
});

export default select;
