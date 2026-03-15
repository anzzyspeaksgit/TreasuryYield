.PHONY: build test coverage deploy

build:
	forge build

test:
	forge test

coverage:
	forge coverage

# Example deployment command to BNB Testnet
deploy-testnet:
	forge script script/Deploy.s.sol:Deploy --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 --broadcast --verify --delay 20 --retries 10
