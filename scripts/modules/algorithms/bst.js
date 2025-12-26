// Генератор шагов BST: поддержка операций вставки, удаления, поиска
export default function bstSteps(operationsList) {
  // operationsList: строка вида 'insert 5, search 8, insert 3'
  if (!operationsList) return [];
  const ops = operationsList
    .split(',')
    .map(line => line.trim().split(' '))
    .filter(parts => parts.length === 2);
  let root = null;
  const steps = [];
  function insert(node, key) {
    if (!node) return { key, left: null, right: null };
    steps.push({ tree: clone(root), highlight: [key], op: 'insert' });
    if (key < node.key) node.left = insert(node.left, key);
    else node.right = insert(node.right, key);
    return node;
  }
  function search(node, key, path=[]) {
    if (!node) {
      steps.push({ tree: clone(root), highlight: path.concat([key]), found: false, op: 'search' });
      return null;
    }
    steps.push({ tree: clone(root), highlight: path.concat([node.key]), op: 'search' });
    if (node.key === key) {
      steps.push({ tree: clone(root), highlight: path.concat([node.key]), found: true, op: 'search' });
      return node;
    }
    if (key < node.key) return search(node.left, key, path.concat([node.key]));
    else return search(node.right, key, path.concat([node.key]));
  }
  function remove(node, key) {
    steps.push({ tree: clone(root), highlight: [key], op: 'delete' });
    if (!node) return null;
    if (key < node.key) node.left = remove(node.left, key);
    else if (key > node.key) node.right = remove(node.right, key);
    else { // delete this node
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let minNode = node.right;
      while (minNode.left) minNode = minNode.left;
      node.key = minNode.key;
      node.right = remove(node.right, minNode.key);
    }
    return node;
  }
  function clone(tree) {
    if (!tree) return null;
    return { key: tree.key, left: clone(tree.left), right: clone(tree.right) };
  }
  for (const [cmd, val] of ops) {
    const key = Number(val);
    if (cmd === 'insert') root = insert(root, key);
    else if (cmd === 'delete') root = remove(root, key);
    else if (cmd === 'search') search(root, key);
  }
  steps.push({ tree: clone(root), highlight: [], op: 'done'});
  return steps;
}

