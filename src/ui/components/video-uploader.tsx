import { Node, mergeAttributes } from "@tiptap/core";

const Video = Node.create({
  name: "video",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "iframe" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        width: "640",
        height: "360",
        frameborder: "0",
        allowfullscreen: "true",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      console.log("Rendering video node:", node.attrs.src);

      const div = document.createElement("div");
      div.className = "relative w-full aspect-w-16 aspect-h-9";

      const iframe = document.createElement("iframe");
      iframe.src = node.attrs.src;
      iframe.width = "640";
      iframe.height = "360";
      iframe.allowFullscreen = true;
      iframe.className = "rounded-lg border shadow-md";

      div.appendChild(iframe);
      return { dom: div };
    };
  },
});

export default Video;
