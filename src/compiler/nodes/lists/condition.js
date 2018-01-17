function compileCondition(items) {
  let sets = [];
  let ifcase = null;
  let elsecase = null;

  items.forEach((item, index) => {
    if (index % 2 === 0) sets.push([item, items[index + 1]])
  });

  if (sets[sets.length - 1][1] === undefined) {
    elsecase = sets.pop()[0];
  }

  ifcase = sets.shift();

  return ""
    + "(function(){\n"
    +   "if (" + ifcase[0].compile() + ") {\nreturn " + ifcase[1].compile() + "\n}"
    +   sets.map(pair => " else if (" + pair[0].compile() + ") {\nreturn " + pair[1].compile() + "\n}").join('')
    +   (!elsecase ? " else {\nreturn\n}" : " else {\nreturn " + elsecase.compile() + "\n}")
    + "\n}).call(this)";
}

export default compileCondition;
