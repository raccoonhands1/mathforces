import openai
import json
import re

class OpenAIParser():
    def __init__(self) -> None:
        self.client = openai.OpenAI(
            api_key = ""
        )
    
    def query_gpt_4_turbo(self, query):
        chat_completion = self.client.chat.completions.create(
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system", 
                    "content": "You are a helpful assistant designed to output JSON."
                },
                {
                    "role": "user",
                    "content": query,
                }
            ],
            model="gpt-4o",
        )
        
        return chat_completion.choices[0].message.content
    
    def evaluate_solution(self, user_solution, reference_problem_solutions):
        solutions = " OR ".join(reference_problem_solutions['solutions'])
        prompt = f'Given the following problem {reference_problem_solutions["problem"]} and correct solutions: {solutions}. \
        Rate the following user solution for its correctness: {user_solution}. \
        Follow this schema for outputting your rating {{ \
        "rating": "an integer value from 0 to 100 rating the correctness", \
        "reason": "A reason for the given rating value" \
        }}'

        output = self.query_gpt_4_turbo(prompt)
        # match = re.search(r'(\d+)%', output)
        # print(output)
        # if match:
        #     return int(match.group(1))
        # else:
        #     return "Unable to determine correctness percentage."
        # TODO validate
        return json.loads(output)
    
# ai_parser = OpenAIParser()
# user_solution = "Use an AND operation across the array"
# reference_problem_solutions = {
#     'problem': "Given a non-empty array of integers, every element appears twice except for one. Find that single one.",
#     'solutions': ["Use XOR operation to solve it in linear time."]
# }
# percentage_correctness = ai_parser.evaluate_solution(user_solution, reference_problem_solutions)
# print(f"Correctness Percentage: {percentage_correctness}")