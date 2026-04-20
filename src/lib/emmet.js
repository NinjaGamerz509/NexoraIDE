// Emmet & Snippet definitions per language

export const HTML_EMMETS = [
  { trigger: '!', preview: '<!DOCTYPE html>...(full boilerplate)', description: 'HTML5 Boilerplate', type: 'emmet' },
  { trigger: 'doc', preview: '<!DOCTYPE html>', description: 'DOCTYPE', type: 'emmet' },
  { trigger: 'html:5', preview: '<html lang="en">...</html>', description: 'HTML5 structure', type: 'emmet' },
  { trigger: 'div', preview: '<div></div>', description: 'Div element', type: 'emmet' },
  { trigger: 'p', preview: '<p></p>', description: 'Paragraph', type: 'emmet' },
  { trigger: 'h1', preview: '<h1></h1>', description: 'Heading 1', type: 'emmet' },
  { trigger: 'h2', preview: '<h2></h2>', description: 'Heading 2', type: 'emmet' },
  { trigger: 'h3', preview: '<h3></h3>', description: 'Heading 3', type: 'emmet' },
  { trigger: 'a', preview: '<a href=""></a>', description: 'Anchor link', type: 'emmet' },
  { trigger: 'img', preview: '<img src="" alt="">', description: 'Image', type: 'emmet' },
  { trigger: 'btn', preview: '<button></button>', description: 'Button', type: 'emmet' },
  { trigger: 'inp', preview: '<input type="text">', description: 'Input field', type: 'emmet' },
  { trigger: 'form', preview: '<form action=""></form>', description: 'Form', type: 'emmet' },
  { trigger: 'select', preview: '<select></select>', description: 'Select dropdown', type: 'emmet' },
  { trigger: 'opt', preview: '<option value=""></option>', description: 'Option', type: 'emmet' },
  { trigger: 'ul', preview: '<ul></ul>', description: 'Unordered list', type: 'emmet' },
  { trigger: 'ol', preview: '<ol></ol>', description: 'Ordered list', type: 'emmet' },
  { trigger: 'li', preview: '<li></li>', description: 'List item', type: 'emmet' },
  { trigger: 'ul>li', preview: '<ul><li></li></ul>', description: 'List with item', type: 'emmet' },
  { trigger: 'table', preview: '<table></table>', description: 'Table', type: 'emmet' },
  { trigger: 'nav', preview: '<nav></nav>', description: 'Navigation', type: 'emmet' },
  { trigger: 'header', preview: '<header></header>', description: 'Header', type: 'emmet' },
  { trigger: 'footer', preview: '<footer></footer>', description: 'Footer', type: 'emmet' },
  { trigger: 'main', preview: '<main></main>', description: 'Main content', type: 'emmet' },
  { trigger: 'section', preview: '<section></section>', description: 'Section', type: 'emmet' },
  { trigger: 'article', preview: '<article></article>', description: 'Article', type: 'emmet' },
  { trigger: 'aside', preview: '<aside></aside>', description: 'Aside', type: 'emmet' },
  { trigger: 'span', preview: '<span></span>', description: 'Inline span', type: 'emmet' },
  { trigger: 'label', preview: '<label for=""></label>', description: 'Label', type: 'emmet' },
  { trigger: 'textarea', preview: '<textarea></textarea>', description: 'Text area', type: 'emmet' },
  { trigger: 'video', preview: '<video src=""></video>', description: 'Video', type: 'emmet' },
  { trigger: 'audio', preview: '<audio src=""></audio>', description: 'Audio', type: 'emmet' },
  { trigger: 'iframe', preview: '<iframe src=""></iframe>', description: 'iFrame', type: 'emmet' },
  { trigger: 'canvas', preview: '<canvas></canvas>', description: 'Canvas', type: 'emmet' },
  { trigger: 'link', preview: '<link rel="stylesheet" href="">', description: 'CSS Link', type: 'emmet' },
  { trigger: 'script', preview: '<script src=""></script>', description: 'Script tag', type: 'emmet' },
  { trigger: 'meta', preview: '<meta name="" content="">', description: 'Meta tag', type: 'emmet' },
];

export const CSS_EMMETS = [
  { trigger: 'd:f', preview: 'display: flex;', description: 'Display flex', type: 'emmet' },
  { trigger: 'd:g', preview: 'display: grid;', description: 'Display grid', type: 'emmet' },
  { trigger: 'd:b', preview: 'display: block;', description: 'Display block', type: 'emmet' },
  { trigger: 'd:n', preview: 'display: none;', description: 'Display none', type: 'emmet' },
  { trigger: 'd:ib', preview: 'display: inline-block;', description: 'Inline block', type: 'emmet' },
  { trigger: 'pos:r', preview: 'position: relative;', description: 'Position relative', type: 'emmet' },
  { trigger: 'pos:a', preview: 'position: absolute;', description: 'Position absolute', type: 'emmet' },
  { trigger: 'pos:f', preview: 'position: fixed;', description: 'Position fixed', type: 'emmet' },
  { trigger: 'pos:s', preview: 'position: sticky;', description: 'Position sticky', type: 'emmet' },
  { trigger: 'jc:c', preview: 'justify-content: center;', description: 'Justify center', type: 'emmet' },
  { trigger: 'jc:sb', preview: 'justify-content: space-between;', description: 'Space between', type: 'emmet' },
  { trigger: 'ai:c', preview: 'align-items: center;', description: 'Align center', type: 'emmet' },
  { trigger: 'w', preview: 'width: ;', description: 'Width', type: 'emmet' },
  { trigger: 'h', preview: 'height: ;', description: 'Height', type: 'emmet' },
  { trigger: 'm', preview: 'margin: ;', description: 'Margin', type: 'emmet' },
  { trigger: 'p', preview: 'padding: ;', description: 'Padding', type: 'emmet' },
  { trigger: 'mt', preview: 'margin-top: ;', description: 'Margin top', type: 'emmet' },
  { trigger: 'mb', preview: 'margin-bottom: ;', description: 'Margin bottom', type: 'emmet' },
  { trigger: 'ml', preview: 'margin-left: ;', description: 'Margin left', type: 'emmet' },
  { trigger: 'mr', preview: 'margin-right: ;', description: 'Margin right', type: 'emmet' },
  { trigger: 'fz', preview: 'font-size: ;', description: 'Font size', type: 'emmet' },
  { trigger: 'fw', preview: 'font-weight: ;', description: 'Font weight', type: 'emmet' },
  { trigger: 'ff', preview: 'font-family: ;', description: 'Font family', type: 'emmet' },
  { trigger: 'ta:c', preview: 'text-align: center;', description: 'Text align center', type: 'emmet' },
  { trigger: 'td:n', preview: 'text-decoration: none;', description: 'No text decoration', type: 'emmet' },
  { trigger: 'bgc', preview: 'background-color: ;', description: 'Background color', type: 'emmet' },
  { trigger: 'bdr', preview: 'border-radius: ;', description: 'Border radius', type: 'emmet' },
  { trigger: 'bxsh', preview: 'box-shadow: ;', description: 'Box shadow', type: 'emmet' },
  { trigger: 'trs', preview: 'transition: ;', description: 'Transition', type: 'emmet' },
  { trigger: 'cur:p', preview: 'cursor: pointer;', description: 'Cursor pointer', type: 'emmet' },
  { trigger: 'ov:h', preview: 'overflow: hidden;', description: 'Overflow hidden', type: 'emmet' },
  { trigger: 'z', preview: 'z-index: ;', description: 'Z-index', type: 'emmet' },
  { trigger: 'op', preview: 'opacity: ;', description: 'Opacity', type: 'emmet' },
  { trigger: 'c', preview: 'color: ;', description: 'Color', type: 'emmet' },
];

export const JS_SNIPPETS = [
  { trigger: 'cl', preview: "console.log()", description: 'Console log', type: 'snippet' },
  { trigger: 'cw', preview: "console.warn()", description: 'Console warn', type: 'snippet' },
  { trigger: 'ce', preview: "console.error()", description: 'Console error', type: 'snippet' },
  { trigger: 'fn', preview: "function name() {}", description: 'Function', type: 'snippet' },
  { trigger: 'afn', preview: "async function name() {}", description: 'Async function', type: 'snippet' },
  { trigger: 'arr', preview: "const arr = []", description: 'Array', type: 'snippet' },
  { trigger: 'obj', preview: "const obj = {}", description: 'Object', type: 'snippet' },
  { trigger: 'imp', preview: "import  from ''", description: 'Import', type: 'snippet' },
  { trigger: 'exp', preview: "export default ", description: 'Export default', type: 'snippet' },
  { trigger: 'prom', preview: "new Promise((resolve, reject) => {})", description: 'Promise', type: 'snippet' },
  { trigger: 'trycatch', preview: "try {} catch(e) {}", description: 'Try/Catch', type: 'snippet' },
  { trigger: 'foreach', preview: ".forEach((item) => {})", description: 'ForEach', type: 'snippet' },
  { trigger: 'map', preview: ".map((item) => {})", description: 'Map', type: 'snippet' },
  { trigger: 'filter', preview: ".filter((item) => {})", description: 'Filter', type: 'snippet' },
  { trigger: 'fetch', preview: "fetch(url).then(r => r.json()).then(data => {})", description: 'Fetch', type: 'snippet' },
  { trigger: 'afetch', preview: "const res = await fetch(url);\nconst data = await res.json();", description: 'Async Fetch', type: 'snippet' },
  { trigger: 'sto', preview: "setTimeout(() => {}, 1000)", description: 'SetTimeout', type: 'snippet' },
  { trigger: 'sti', preview: "setInterval(() => {}, 1000)", description: 'SetInterval', type: 'snippet' },
];

export const REACT_SNIPPETS = [
  { trigger: 'rfc', preview: "const Component = () => {\n  return (<div></div>);\n};\nexport default Component;", description: 'React Functional Component', type: 'snippet' },
  { trigger: 'rfce', preview: "export default function Component() {\n  return (<div></div>);\n}", description: 'React FC with export', type: 'snippet' },
  { trigger: 'rus', preview: "const [state, setState] = useState()", description: 'useState hook', type: 'snippet' },
  { trigger: 'rue', preview: "useEffect(() => {\n  \n  return () => {};\n}, [])", description: 'useEffect hook', type: 'snippet' },
  { trigger: 'ruc', preview: "const value = useContext(Context)", description: 'useContext hook', type: 'snippet' },
  { trigger: 'rur', preview: "const ref = useRef(null)", description: 'useRef hook', type: 'snippet' },
  { trigger: 'rum', preview: "const value = useMemo(() => {}, [])", description: 'useMemo hook', type: 'snippet' },
  { trigger: 'rucb', preview: "const fn = useCallback(() => {}, [])", description: 'useCallback hook', type: 'snippet' },
  { trigger: 'imp', preview: "import React from 'react'", description: 'Import React', type: 'snippet' },
  { trigger: 'imps', preview: "import { useState } from 'react'", description: 'Import useState', type: 'snippet' },
];

export const NEXTJS_SNIPPETS = [
  { trigger: 'npage', preview: "export default function Page() {\n  return <div></div>;\n}", description: 'Next.js Page', type: 'snippet' },
  { trigger: 'napi', preview: "export async function GET(req) {\n  return Response.json({})\n}", description: 'Next.js API Route', type: 'snippet' },
  { trigger: 'ngsp', preview: "export async function getServerSideProps(ctx) {\n  return { props: {} };\n}", description: 'getServerSideProps', type: 'snippet' },
  { trigger: 'nlink', preview: "<Link href=\"\"></Link>", description: 'Next.js Link', type: 'snippet' },
  { trigger: 'nimg', preview: "<Image src=\"\" alt=\"\" width={} height={} />", description: 'Next.js Image', type: 'snippet' },
  { trigger: 'nuse', preview: "'use client'", description: 'Use Client directive', type: 'snippet' },
  { trigger: 'nrouter', preview: "const router = useRouter()", description: 'useRouter hook', type: 'snippet' },
];

export const NODE_SNIPPETS = [
  { trigger: 'req', preview: "const express = require('express')", description: 'Require Express', type: 'snippet' },
  { trigger: 'app', preview: "const app = express()", description: 'Create app', type: 'snippet' },
  { trigger: 'get', preview: "app.get('/', (req, res) => {\n  res.json({})\n})", description: 'GET route', type: 'snippet' },
  { trigger: 'post', preview: "app.post('/', (req, res) => {\n  res.json({})\n})", description: 'POST route', type: 'snippet' },
  { trigger: 'listen', preview: "app.listen(PORT, () => console.log(`Server running on ${PORT}`))", description: 'App listen', type: 'snippet' },
  { trigger: 'mongo', preview: "mongoose.connect(process.env.MONGODB_URI)", description: 'MongoDB connect', type: 'snippet' },
  { trigger: 'schema', preview: "const Schema = new mongoose.Schema({\n  \n})", description: 'Mongoose Schema', type: 'snippet' },
];

export const EMMET_MAP = {
  html: HTML_EMMETS,
  css: CSS_EMMETS,
  js: JS_SNIPPETS,
  jsx: [...JS_SNIPPETS, ...REACT_SNIPPETS],
  ts: JS_SNIPPETS,
  tsx: [...JS_SNIPPETS, ...REACT_SNIPPETS],
  json: [],
  md: [],
};

// Full emmet expansions for Monaco
export const HTML_EMMET_EXPANSIONS = {
  '!': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  $0
</body>
</html>`,
  'doc': '<!DOCTYPE html>',
  'html:5': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$1</title>
</head>
<body>
  $0
</body>
</html>`,
};

export const JS_SNIPPET_EXPANSIONS = {
  'cl': 'console.log($1);$0',
  'cw': 'console.warn($1);$0',
  'ce': 'console.error($1);$0',
  'fn': 'function ${1:name}(${2:params}) {\n\t$0\n}',
  'afn': 'async function ${1:name}(${2:params}) {\n\t$0\n}',
  'arr': 'const ${1:arr} = [$0]',
  'obj': 'const ${1:obj} = {$0}',
  'imp': "import ${2:name} from '${1:module}';$0",
  'exp': 'export default $0',
  'trycatch': 'try {\n\t$1\n} catch (${2:error}) {\n\t$0\n}',
  'foreach': '${1:arr}.forEach((${2:item}) => {\n\t$0\n});',
  'map': '${1:arr}.map((${2:item}) => {\n\t$0\n})',
  'filter': '${1:arr}.filter((${2:item}) => $0)',
  'fetch': "fetch('${1:url}')\n\t.then(r => r.json())\n\t.then(${2:data} => {\n\t\t$0\n\t})",
  'afetch': "const ${1:res} = await fetch('${2:url}');\nconst ${3:data} = await ${1:res}.json();\n$0",
  'prom': 'new Promise((${1:resolve}, ${2:reject}) => {\n\t$0\n})',
  'sto': 'setTimeout(() => {\n\t$0\n}, ${1:1000})',
  'sti': 'setInterval(() => {\n\t$0\n}, ${1:1000})',
};

export const REACT_SNIPPET_EXPANSIONS = {
  'rfc': "const ${1:Component} = () => {\n\treturn (\n\t\t<div>$0</div>\n\t);\n};\n\nexport default ${1:Component};",
  'rfce': "export default function ${1:Component}() {\n\treturn (\n\t\t<div>$0</div>\n\t);\n}",
  'rus': "const [${1:state}, set${1/(.)/\\u$1/}] = useState($2);$0",
  'rue': "useEffect(() => {\n\t$1\n\treturn () => {\n\t\t$2\n\t};\n}, [$0]);",
  'ruc': "const ${1:value} = useContext(${2:Context});$0",
  'rur': "const ${1:ref} = useRef(${2:null});$0",
  'rum': "const ${1:value} = useMemo(() => {\n\t$2\n}, [$0]);",
  'rucb': "const ${1:fn} = useCallback(() => {\n\t$2\n}, [$0]);",
  'imp': "import React from 'react';\n$0",
  'imps': "import { ${1:useState} } from 'react';\n$0",
  'npage': "export default function ${1:Page}() {\n\treturn (\n\t\t<div>$0</div>\n\t);\n}",
  'napi': "export async function GET(req) {\n\ttry {\n\t\t$1\n\t\treturn Response.json({ $0 });\n\t} catch (error) {\n\t\treturn Response.json({ error: error.message }, { status: 500 });\n\t}\n}",
  'nuse': "'use client';\n$0",
  'nrouter': "const router = useRouter();\n$0",
  'nlink': '<Link href="${1:}">${2}</Link>$0',
};
