
export interface LightStateSetters<T extends LightStateSetters<any>> {
  /**
   * Sets the state of the light (on or off)
   */
  on (state?: boolean): T

  /**
   * Sets the absolute brightness of the light
   */
  bri (
    /**
     * The absolute brightness to set the light to
     *
     * (min 1, max 254)
     */
    brightness: number,
  ): T

  /**
   * Sets the percentage brightness of the light
   */
  brightness (
    /**
     * The percentage brightness to set the light to
     *
     * (min 0, max 100)
     */
    brightness: number,
  ): T

  /**
   * Sets the hue of the light
   */
  hue (
    /**
     * The hue to set the light to
     *
     * (min 0, max 65535)
     *
     * - Red - 0 and 65535
     * - Green - 25500
     * - Blue - 46920
     */
    hue: number,
  ): T

  /**
   * Sets the absolute saturation of the light
   */
  sat (
    /**
     * The absolute saturation to set the light to
     *
     * (min 1, max 254)
     */
    saturation: number,
  ): T

  /**
   * Sets the percentage saturation of the light
   */
  saturation (
    /**
     * The percentage saturation to set the light to
     *
     * (min 0, max 100)
     */
    brightness: number,
  ): T

  /**
   * Sets the Mired color temperature for the light
   */
  ct (
    /**
     * The Mired color temperature
     *
     * (min 153,  max 500)
     *
     * - 6500K = 153
     * - 2000K = 500
     */
    value: number,
  ): T

  effect (effect: 'colorloop' | 'none'): T

  /**
   * Set the duration of transitions in multiples of 100ms
   *
   * - 0 === instant
   * - 1 === 0.1s
   * - 4 === 0.4s
   * - 10 === 1s
   */
  transitiontime (
    /**
     * The duration of the transition in multiples of 100ms
     *
     * - 0 === instant
     * - 1 === 0.1s
     * - 4 === 0.4s
     * - 10 === 1s
     */
    time: number,
  ): T

  /**
   * Set the duration of transitions
   */
  transtionInMiilis (
    /**
     * The duration of the transition
     */
    ms: number,
  ): T

  /**
   * Set the alert state of the light
   */
  alert (
    /**
     * The new alert state of the light
     *
     * - 'none' = normal state for a light
     * - 'select' = one breathe cycle
     * - 'lselect' = breathe cycles for 15 seconds or until reset to 'none'
     */
    alertState: 'none' | 'select' | 'lselect',
  ): T
}

type Arg<T> = T extends ((arg: infer A) => any)
  ? A
  : never

export type LightPopulation = {
  [key in keyof LightStateSetters<any>]?: Arg<LightStateSetters<any>[key]>
}

export interface CommonLightState<T extends CommonLightState<any>> extends LightStateSetters<CommonLightState<T>> {
  reset (): T
  getPayload (): any
  populate (population: LightPopulation): T
  off (): T

  /**
   * Sets the hue within the CIE color space
   */
  xy (
    /**
     * The x coordinate in the CIE color space
     *
     * (min 0,  max 1)
     */
    x: number,
    /**
     * The y coordinate in the CIE color space
     *
     * (min 0, max 1)
     */
    y: number,
  ): T

  // Effect shorthand
  effectColorLoop (): T
  effectNone (): T

  // Transition shorthand
  transitionSlow (): T
  transitionDefault (): T
  transtionFast (): T
  transtionInstant (): T

  // Alert shorthand
  alertNone (): T
  alertShort (): T
  alertLong (): T
}

export interface LightState extends CommonLightState<LightState> {
  white (temp: number, brightness: number): LightState
  hsb (hue: number, saturation: number, brightness: number): LightState
  hsl (hue: number, saturation: number, luminosity: number): LightState
  rgb (red: number, green: number, blue: number): LightState
}

export interface SceneLightState extends CommonLightState<SceneLightState> {
}

export interface GroupLightState extends CommonLightState<GroupLightState> {
  scene (name: string): GroupLightState
}
