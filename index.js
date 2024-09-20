const { parse: parser } = require("node-html-parser");
let generateRichTextJSON = (root, originalProperties = {}) => {
  let children = [];
  root.childNodes.forEach((item) => {
    delete item.parentNode;
    // console.log(item);
    if (item.constructor.name == "HTMLElement") {
      let child = null;
      switch (item.rawTagName) {
        case "br":
          child = { type: "text", value: "\n" };
          break;
        case "b":
        case "strong":
          child = {
            type: null,
            children: generateRichTextJSON(item, {
              ...originalProperties,
              bold: true,
            }),
          };
          break;
        case "i":
        case "em":
          child = {
            type: null,
            children: generateRichTextJSON(item, {
              ...originalProperties,
              italic: true,
            }),
          };
          break;
        case "p":
          child = {
            type: "paragraph",
            children: generateRichTextJSON(item, {
              ...originalProperties,
            }),
          };
          break;
        case "a":
          child = {
            type: "link",
            url: "#",
            title: null,
            target: null,
            children: generateRichTextJSON(item, {
              ...originalProperties,
            }),
          };
          break;
        case "ul":
          child = {
            listType: "unordered",
            type: "list",
            children: generateRichTextJSON(item, {
              ...originalProperties,
            }),
          };
        case "ol":
          child = {
            listType: "ordered",
            type: "list",
            children: generateRichTextJSON(item, {
              ...originalProperties,
            }),
          };
          break;
        case "li":
          child = {
            type: "list-item",
            children: generateRichTextJSON(item, {
              ...originalProperties,
            }),
          };
          break;
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          child = {
            type: "heading",
            level: parseInt(item.rawTagName.split("h")[1]),
            children: generateRichTextJSON(item, {
              ...originalProperties,
            }),
          };
          break;
        default:
          console.log("defaulted on: ");
          console.log(item.rawTagName);
          child = { type: null, properties: { ...originalProperties } };
          break;
      }
      children.push(child);
    } else {
      let finalObj = {
        type: "text",
        value: item._rawText,
      };
      if (originalProperties.bold) finalObj.bold = true;
      if (originalProperties.italic) finalObj.italic = true;
      children.push(finalObj);
    }
  });
 
  return children;
};
let yourHtml = `<p>TEST123</p><p><strong>TEST123</strong></p><p><em><strong>TEST</strong></em></p><p><a href="#">123</a></p><h2>&amp;é"</h2><p></p><ol><li><strong>&amp;é"&amp;é"</strong></li><li><h1><strong>"&amp;é"</strong></h1></li></ol><p><strong></strong></p><ul><li><strong>123123</strong></li></ul>`;
let root = parser(`<div>${yourHtml}</div>`);

let richTextJSON = {
  type: "root",
  children: generateRichTextJSON(root.querySelector("div")),
};


console.log(JSON.stringify(richTextJSON));

