function compileDoBlock(items) {
  const body = items.map((action, index) => {
    return (index === items.length - 1 ? "return " : "") + action.compile();
  }).join(';\n') + ';';
  return "(function(){\n"+ body +"\n}).call(this)";
}

export default compileDoBlock;
