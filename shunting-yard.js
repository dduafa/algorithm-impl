/**
 * https://en.wikipedia.org/wiki/Shunting-yard_algorithm
 * Invented by Edsger Dijkstra
 * Shunting-yard algorithm is a method for parsing mathematical expressions specified in infix notation.
 *
 * It can produce either:
 * 1. Postfix notation string --> Reverse Polish Notation(RPN)
 *
 *                      OR
 *
 * 2. an Abstract Syntax Tree (AST)
 * 
 * ########### PSEUDOCODE ########################################
 * 
 * if number, push to the output-queue
 * if operator:
 *    check if:
 *      - stack is not empty
 *      - precedence is less than what is on top of operator-stack
 *      - associacity is 'left'
 *          push all operators in operator-stack to output-queue
 *    push operator to operator-stack
 * if left parenthesis:
 *    push it to the operator-stack
 * if right parenthesis:
 *    push all operators on the operator-stack to the output-queue,
 *    until you find a left parenthesis '('
 *
 *    remove the left parenthesis '(' from the operator-stack
 *
 * push all operators in the operator-stack to the output-queue
 */

const assert = require('assert');

const OPERATORS = {
    '^': { precedence: 4, associativity: 'right' },
    '*': { precedence: 3, associativity: 'left' },
    '/': { precedence: 3, associativity: 'left' },
    '+': { precedence: 2, associativity: 'left' },
    '-': { precedence: 2, associativity: 'left' }
};

function shunting_yard_algorithm(expression) {
    let operatorStack = [];
    let outputQueue = [];

    for (let current of expression) {
        if (isNumber(current)) {
            outputQueue.push(current);
        } else if (isOperator(current)) {
            while (
                operatorStack.length &&
                OPERATORS[current]?.precedence <=
                    OPERATORS[operatorStack[operatorStack.length - 1]]
                        ?.precedence &&
                OPERATORS[operatorStack[operatorStack.length - 1]]
                    .associativity === 'left'
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(current);
        } else if (current === '(') {
            operatorStack.push(current);
        } else if (current === ')') {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== '('
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}

function isNumber(value) {
    return value.match(/[0-9]/);
}

function isOperator(value) {
    return OPERATORS[value];
}

assert.equal(
    JSON.stringify(
        shunting_yard_algorithm('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3'.split(''))
    ),
    JSON.stringify([
        '3',
        '4',
        '2',
        '*',
        '1',
        '5',
        '-',
        '2',
        '3',
        '^',
        '^',
        '/',
        '+'
    ])
);
assert.equal(
    JSON.stringify(shunting_yard_algorithm('3 + 4 * 2 - 9'.split(''))),
    JSON.stringify(['3', '4', '2', '*', '+', '9', '-'])
);
