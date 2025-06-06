import { useCallback, useContext } from "react"
import { AppContext } from "src/utils/context"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams, Transaction } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  const { cache } = useContext(AppContext)

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })


      if (cache?.current) {
        const cacheKeys = Array.from(cache.current.keys())

        cacheKeys.forEach(key => {
          if (key.startsWith('paginatedTransactions') || key.startsWith('transactionsByEmployee')) {
            const cachedData = cache.current?.get(key)
            if (cachedData) {
              try {
                const parsedData = JSON.parse(cachedData)
                let updated = false

                if (key.startsWith('paginatedTransactions') && parsedData.data) {
                  parsedData.data = parsedData.data.map((transaction: Transaction) => {
                    if (transaction.id === transactionId) {
                      updated = true
                      return { ...transaction, approved: newValue }
                    }
                    return transaction
                  })

                  if (updated && cache.current) {
                    cache.current.set(key, JSON.stringify(parsedData))
                  }
                } else if (key.startsWith('transactionsByEmployee') && Array.isArray(parsedData)) {
                  const updatedData = parsedData.map((transaction: Transaction) => {
                    if (transaction.id === transactionId) {
                      updated = true
                      return { ...transaction, approved: newValue }
                    }
                    return transaction
                  })

                  if (updated && cache.current) {
                    cache.current.set(key, JSON.stringify(updatedData))
                  }
                }
              } catch (error) {
                cache.current?.delete(key)
              }
            }
          }
        })
      }
    },
    [fetchWithoutCache, cache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}