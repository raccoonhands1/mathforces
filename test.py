import mathgenerator as mg

#generate an addition problem
problem, solution = mg.power_rule_differentiation(100, 100, 500)

#another way to generate an addition problem using genById()
problem, solution = mg.genById(0)

print(problem, solution)
