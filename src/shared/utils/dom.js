export const getAllNodesFromDOM = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let currNode = walker.currentNode;
  let nodes = [];
  while (currNode) {
    nodes = [...nodes, currNode];
    currNode = walker.nextNode();
  }
  return nodes;
};
