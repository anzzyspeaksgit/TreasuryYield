.PHONY: build test coverage snapshot deploy

build:
	forge build

test:
	forge test

coverage:
	forge coverage

snapshot:
	forge snapshot

deploy-testnet:
	forge script script/Deploy.s.sol:Deploy --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 --broadcast --verify --delay 20 --retries 10

deploy-local:
	forge script script/Deploy.s.sol:Deploy --rpc-url http://127.0.0.1:8545 --broadcast
