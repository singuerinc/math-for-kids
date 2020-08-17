import * as React from "react";
import { simple } from "./math";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

type Context = {
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
      problem: {
        first: 0,
        second: 0,
      },
      result: 0,
    },
    initial: "home",
    states: {
      home: {
        on: {
          "": "sum",
        },
      },
      sum: {
        entry: "bla",
        on: {
          RESULT: "result",
        },
      },
      result: {
        on: {
          SUM: "sum",
        },
      },
    },
  },
  {
    actions: {
      bla: assign(() => {
        const first = simple();
        const second = simple();
        return {
          result: first + second,
          problem: {
            first,
            second,
          },
        };
      }),
    },
  }
);

export function App() {
  const [current, send] = useMachine(machine);

  return (
    <div>
      {current.matches("home") && (
        <section>
          <div>HOME</div>
        </section>
      )}
      {current.matches("sum") && (
        <section>
          <h1>{`${current.context.problem.first}+${current.context.problem.second}`}</h1>
          <a onClick={() => send("RESULT")}>show result</a>
        </section>
      )}
      {current.matches("result") && (
        <section>
          <h1>{`${current.context.result}`}</h1>
          <a onClick={() => send("SUM")}>next!</a>
        </section>
      )}
    </div>
  );
}
