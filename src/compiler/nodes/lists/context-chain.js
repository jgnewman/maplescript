function compileContextChain(items) {
  return `(function(){
    var ref_ = this;
    ${items.map(item => {
      return "(function(){ ref_ = " + item.compile(true) + " }).call(ref_);"
    }).join('\n')}
    return ref_;
  }).call(this)`;
}

export default compileContextChain;
