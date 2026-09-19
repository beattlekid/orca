import { useLocalSearchParams } from 'expo-router'
import { BridgeInitRouteSchema } from '../../../src/mobile-web-shell/bridge/bridge-envelope'
import { MobileWebShellScreen } from '../../../src/mobile-web-shell/MobileWebShellScreen'
import { useMobileWebShellEnabled } from '../../../src/mobile-web-shell/use-mobile-web-shell-enabled'
import { MobileTasksScreen } from '../../../src/tasks/MobileTasksScreen'

/**
 * The shell's switch for this route, in `index.tsx`'s shape.
 *
 * The page is opened from the native home screen, so the pathname and the provider param are what
 * the shell tells it; `taskSource` rides in `init.route.params`, which the page folds back into
 * its own URL before the first render.
 */
export default function MobileTasksRoute() {
  const { hostId, taskSource } = useLocalSearchParams<{ hostId: string; taskSource?: string }>()
  const enabled = useMobileWebShellEnabled()
  const native = <MobileTasksScreen />

  if (enabled !== true || !hostId) {
    return native
  }
  const route = {
    pathname: `/h/${encodeURIComponent(hostId)}/tasks`,
    // Omitted rather than empty: an absent provider lets the page pick its own default, where
    // `taskSource=` is a provider named nothing.
    ...(taskSource === undefined || taskSource === '' ? {} : { params: { taskSource } })
  }
  if (!BridgeInitRouteSchema.safeParse(route).success) {
    return native
  }
  return (
    <MobileWebShellScreen
      // Keyed for the reason every shell route is: a host holds the grants its session opened
      // with, so a host id change must be a remount rather than a prop update.
      key={hostId}
      hostId={hostId}
      route={route}
      fallback={native}
    />
  )
}
