import { useDictStats } from './hooks/useDictStats'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { currentDictIdAtom } from '@/store'
import { DictionaryResource } from '@/typings'
import { calcChapterCount } from '@/utils'
import * as Progress from '@radix-ui/react-progress'
import { useAtomValue } from 'jotai'
import { useRef } from 'react'

interface Props {
  dictionary: DictionaryResource
  onClick?: () => void
}

function Dictionary({ dictionary, onClick }: Props) {
  const currentDictID = useAtomValue(currentDictIdAtom)

  const divRef = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(divRef, {})
  const isVisible = !!entry?.isIntersecting
  const DictStats = useDictStats(dictionary.id, isVisible)
  const chapterCount = calcChapterCount(dictionary.length)
  const progress = DictStats ? DictStats.exercisedChapterCount / chapterCount : 0

  return (
    <div
      ref={divRef}
      className={`flex w-60 items-center justify-center overflow-hidden rounded-md border border-gray-300 bg-gray-50 p-4 text-left shadow-lg focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:bg-opacity-10 ${
        currentDictID === dictionary.id ? 'ring-2 ring-indigo-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex h-full w-full flex-col items-start justify-start ">
        <h1 className="mb-1 text-xl font-normal">{dictionary.name}</h1>
        <p className="mb-1 text-xs text-gray-600">{dictionary.description}</p>
        <p className="mb-1 text-sm font-bold text-gray-600">{dictionary.length} 词</p>
        <div className="mb-0 flex w-full items-center">
          <Progress.Root value={progress} max={100} className="mr-4 h-3.5 w-full rounded-full border-2 border-indigo-300 bg-white">
            <Progress.Indicator
              className="h-full -translate-x-px rounded-full bg-indigo-300 pl-0"
              style={{ width: `calc(${progress}% + 2px)` }}
            />
          </Progress.Root>
        </div>
      </div>
    </div>
  )
}

export default Dictionary