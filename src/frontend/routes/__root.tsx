import { createRootRoute } from '@tanstack/react-router';

import alloyLogo from '../assets/alloy.png';
import icLogo from '../assets/ic.svg';
import { backend } from '../../backend/declarations';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { data: isPollingResult } = useQuery({
    queryKey: ['watch_usdc_transfer_is_polling'],
    queryFn: () => backend.watch_usdc_transfer_is_polling(),
    refetchInterval: 5000,
  });

  /*
  const {
    data: pollCountResult,
  } = useQuery({
    queryKey: ['watch_usdc_transfer_poll_count'],
    queryFn: () => backend.watch_usdc_transfer_poll_count(),
    refetchInterval: 5000,
  })*/

  const { data: getResult } = useQuery({
    queryKey: ['watch_usdc_transfer_get'],
    queryFn: () => backend.watch_usdc_transfer_get(),
    refetchInterval: 5000,
  });

  const {
    data: startResult,
    isPending: isFetchingStart,
    mutate: start,
  } = useMutation({
    mutationFn: () => backend.watch_usdc_transfer_start(),
  });

  const {
    data: stopResult,
    isPending: isFetchingStop,
    mutate: stop,
  } = useMutation({
    mutationFn: () => backend.watch_usdc_transfer_stop(),
  });

  useEffect(() => {
    start();
  }, []);

  const isPolling =
    isPollingResult && 'Ok' in isPollingResult && isPollingResult.Ok === true;
  //const pollCount = pollCountResult && 'Ok' in pollCountResult ? pollCountResult.Ok : 0;

  return (
    <main>
      <div>
        <a href="https://alloy.rs" target="_blank" rel="noreferrer">
          <img src={alloyLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://internetcomputer.org" target="_blank" rel="noreferrer">
          <img src={icLogo} className="logo" alt="React logo" />
        </a>
      </div>
      <h1>Alloy + ICP</h1>
      <div>
        Watch whales on Base Mainnet that trasfer more than 1.000.000 USDC
      </div>

      <>
        <div className="card">
          <div>{isFetchingStart && 'Requesting…'}</div>
          <div>
            {isPolling
              ? `🟢 Watching for transfers` //, ${pollCount}/3`
              : '🔴 Not watching for transfers'}
          </div>

          {/*
          <button disabled={isFetchingStart} onClick={() => void start()}>
            {isFetchingStart ? 'Requesting…' : 'watch_usdc_transfer_start()'}
          </button>
          */}
          {startResult && <pre>{JSON.stringify(startResult, null, 2)}</pre>}

          <button disabled={isFetchingStop} onClick={() => void stop()}>
            {isFetchingStop ? 'Requesting…' : 'watch_usdc_transfer_stop()'}
          </button>
          {stopResult && <pre>{JSON.stringify(stopResult, null, 2)}</pre>}

          {getResult && <pre>{JSON.stringify(getResult, null, 2)}</pre>}
        </div>
      </>
    </main>
  );
}
