import assert from "assert";
import * as anchor from "@project-serum/anchor";
const { SystemProgram } = anchor.web3;

describe("Solana Calculator dApp", () => {
  const provider = anchor.Provider.local();
  let _calculator;
  // anchor.setProvider(provider);
  anchor.setProvider(anchor.Provider.env());

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.SolanaCalculatorDapp;

  it("Creates a Calculator:", async () => {
    try {
      await program.rpc.create("Welcome to Solana", {
        accounts: {
          calculator: calculator.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [calculator]
      })

      const account = await program.account.calculator.fetch(calculator.publicKey);
      assert.ok(account.greeting === "Welcome to Solana");
      _calculator = calculator;
    } catch (error) {
      assert.fail(error);
    }
  })

  it("Adds two numbers:", async () => {
    const calculator = _calculator;
    // await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
    //   accounts: {
    //     calculator: calculator.publicKey,
    //   }
    // })
    await program.rpc.calculate("ADD", new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Subtracts two numbers:", async () => {
    const calculator = _calculator;
    // await program.rpc.subtract(new anchor.BN(5), new anchor.BN(3), {
    //   accounts: {
    //     calculator: calculator.publicKey,
    //   }
    // })
    await program.rpc.calculate("SUB", new anchor.BN(5), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(2)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Multiplies two numbers:", async () => {
    const calculator = _calculator;
    // await program.rpc.multiply(new anchor.BN(5), new anchor.BN(3), {
    //   accounts: {
    //     calculator: calculator.publicKey,
    //   }
    // })
    await program.rpc.calculate("MUL", new anchor.BN(5), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(15)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Divides two numbers without remainder:", async () => {
    const calculator = _calculator;
    // await program.rpc.divide(new anchor.BN(15), new anchor.BN(3), {
    //   accounts: {
    //     calculator: calculator.publicKey,
    //   }
    // })
    await program.rpc.calculate("DIV", new anchor.BN(15), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Divides two numbers with remainder:", async () => {
    const calculator = _calculator;
    // await program.rpc.divide(new anchor.BN(15), new anchor.BN(2), {
    //   accounts: {
    //     calculator: calculator.publicKey,
    //   }
    // })
    await program.rpc.calculate("DIV", new anchor.BN(15), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      }
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(7)));
    assert.ok(account.remainder.eq(new anchor.BN(1)));
    assert.ok(account.greeting === "Welcome to Solana");
  })
})