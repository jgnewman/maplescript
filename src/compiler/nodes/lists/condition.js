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
    + "(function () {\n"
    +   "if (" + ifcase[0].compile(true) + ") {\nreturn " + ifcase[1].compile(true) + "\n}"
    +   sets.map(pair => " else if (" + pair[0].compile(true) + ") {\nreturn " + pair[1].compile(true) + "\n}").join('')
    +   (!elsecase ? " else {\nreturn\n}" : " else {\nreturn " + elsecase.compile(true) + "\n}")
    + "\n}).call(this)";
}

export default compileCondition;
