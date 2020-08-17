import * as React from "react";
import { oneDigit, twoDigits } from "./math";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";
import colors from "open-color/open-color.json";

const colorList = [
  // "red",
  // "pink",
  // "grape",
  // "violet",
  "indigo",
  // "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  // "yellow",
  "orange"
];

const randomColorName = () =>
  colorList[Math.floor(colorList.length * Math.random())];
const randomColor = () =>
  colors[randomColorName()][3 + Math.floor(Math.random() * 3)];

type Context = {
  mode: number;
  problem: {
    first: number;
    second: number;
  };
  result: number;
};

const machine = Machine<Context>(
  {
    strict: true,
    id: "sums",
    context: {
      mode: 1,
      problem: {
        first: 0,
        second: 0
      },
      result: 0
    },
    initial: "home",
    states: {
      home: {
        on: {
          ONE: {
            actions: [assign({ mode: 1 }), "fullscreen"],
            target: "sum"
          },
          TWO: {
            actions: [assign({ mode: 2 }), "fullscreen"],
            target: "sum"
          }
        }
      },
      sum: {
        entry: "getProblem",
        on: {
          RESULT: "result",
          HOME: "home"
        }
      },
      result: {
        on: {
          SUM: "sum",
          HOME: "home"
        }
      }
    }
  },
  {
    actions: {
      fullscreen: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        }
      },
      getProblem: assign(context => {
        const { mode } = context;
        const first = mode === 1 ? oneDigit() : twoDigits();
        const second = oneDigit();
        return {
          result: first + second,
          problem: {
            first,
            second
          }
        };
      })
    }
  }
);

export function App() {
  const [current, send] = useMachine(machine);

  return (
    <div>
      <section style={{ backgroundColor: randomColor() }}>
        {current.matches("home") && (
          <>
            <h1>Math!</h1>
            <a onClick={() => send("ONE")}>one digit</a>
            <a onClick={() => send("TWO")}>two digits</a>
          </>
        )}
        {current.matches("sum") && (
          <>
            <i onClick={() => send("HOME")}>&#10005;</i>
            <h1>
              {`${current.context.problem.first}`}
              <span>+</span>
              {`${current.context.problem.second}`}
            </h1>
            <a onClick={() => send("RESULT")}>show result</a>
          </>
        )}
        {current.matches("result") && (
          <>
            <i onClick={() => send("HOME")}>&#10005;</i>
            <h2>
              {`${current.context.problem.first}`}
              <span>+</span>
              {`${current.context.problem.second}`}=
              {`${current.context.result}`}
            </h2>
            <a onClick={() => send("SUM")}>next!</a>
          </>
        )}
      </section>
    </div>
  );
}
