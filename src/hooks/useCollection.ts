import React, { useState, useEffect } from 'react'
import { db } from '../App'

/** useCollection types  **/
type IUseCollection<ICollection> = [
  ICollection[],
  React.Dispatch<React.SetStateAction<ICollection[]>>,
]

export function useCollection<ICollection>(
  path: string,
  order?: string | null,
  signature?: { [key: string]: string } | null,
): IUseCollection<ICollection> {
  const [collectionItems, setCollectionItems] = useState<ICollection[]>([])

  useEffect(() => {
    const request = order
      ? db.collection(path).orderBy(order, 'asc')
      : db.collection(path)

    return request.onSnapshot(snapshot => {
      const items: ICollection[] = []
      /* eslint-disable @typescript-eslint/no-explicit-any */
      snapshot.forEach((doc: { [key: string]: any }) => {
        const data: { [key: string]: any } = {}
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (signature && typeof signature === 'object') {
          for (const key in signature) {
            data[key] = signature[key] === 'func' ? doc[key]() : doc[key]
          }
          items.push(data as ICollection)
        } else {
          items.push(doc.data() as ICollection)
        }
      })

      setCollectionItems(items)
    })
  }, [path, order, signature])

  return [collectionItems, setCollectionItems]
}
