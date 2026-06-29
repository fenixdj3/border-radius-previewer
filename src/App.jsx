import { useState, useRef, useCallback } from 'react'
import { Copy, Check, RefreshCw, Moon, Sun } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

function App() {
  const [mode, setMode] = useState('simple') // 'simple' for 4 values, 'advanced' for 8 values
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [unit, setUnit] = useState('px') // 'px' or '%'
  const [showGrid, setShowGrid] = useState(false)
  const [boxWidth, setBoxWidth] = useState(192) // box width in pixels
  const [boxHeight, setBoxHeight] = useState(192) // box height in pixels

  // Simple mode: 4 values (top-left, top-right, bottom-right, bottom-left)
  const [simpleRadius, setSimpleRadius] = useState({
    topLeft: 20,
    topRight: 20,
    bottomRight: 20,
    bottomLeft: 20,
  })

  // Advanced mode: 8 values (horizontal and vertical for each corner)
  const [advancedRadius, setAdvancedRadius] = useState({
    topLeftH: 20,
    topLeftV: 20,
    topRightH: 20,
    topRightV: 20,
    bottomRightH: 20,
    bottomRightV: 20,
    bottomLeftH: 20,
    bottomLeftV: 20,
  })

  // Presets
  const presets = [
    { name: 'Default', simple: { topLeft: 20, topRight: 20, bottomRight: 20, bottomLeft: 20 } },
    { name: 'Circle', simple: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 } },
    { name: 'Pill', simple: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 } },
    { name: 'Leaf', simple: { topLeft: 50, topRight: 0, bottomRight: 50, bottomLeft: 0 } },
    { name: 'Egg', simple: { topLeft: 60, topRight: 60, bottomRight: 40, bottomLeft: 40 } },
    { name: 'Blob', simple: { topLeft: 30, topRight: 70, bottomRight: 30, bottomLeft: 70 } },
  ]

  const getBorderRadiusCSS = () => {
    if (mode === 'simple') {
      const { topLeft, topRight, bottomRight, bottomLeft } = simpleRadius
      return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`
    } else {
      const { topLeftH, topLeftV, topRightH, topRightV, bottomRightH, bottomRightV, bottomLeftH, bottomLeftV } = advancedRadius
      return `border-radius: ${topLeftH}${unit} ${topRightH}${unit} ${bottomRightH}${unit} ${bottomLeftH}${unit} / ${topLeftV}${unit} ${topRightV}${unit} ${bottomRightV}${unit} ${bottomLeftV}${unit};`
    }
  }

  const applyPreset = (preset) => {
    setSimpleRadius(preset.simple)
    setMode('simple')
  }

  const getBoxStyle = () => {
    if (mode === 'simple') {
      const { topLeft, topRight, bottomRight, bottomLeft } = simpleRadius
      return {
        borderRadius: `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`,
        width: `${boxWidth}px`,
        height: `${boxHeight}px`,
      }
    } else {
      const { topLeftH, topLeftV, topRightH, topRightV, bottomRightH, bottomRightV, bottomLeftH, bottomLeftV } = advancedRadius
      return {
        borderRadius: `${topLeftH}${unit} ${topRightH}${unit} ${bottomRightH}${unit} ${bottomLeftH}${unit} / ${topLeftV}${unit} ${topRightV}${unit} ${bottomRightV}${unit} ${bottomLeftV}${unit}`,
        width: `${boxWidth}px`,
        height: `${boxHeight}px`,
      }
    }
  }

  const copyToClipboard = async () => {
    const css = getBorderRadiusCSS()
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const resetValues = () => {
    if (mode === 'simple') {
      setSimpleRadius({ topLeft: 20, topRight: 20, bottomRight: 20, bottomLeft: 20 })
    } else {
      setAdvancedRadius({
        topLeftH: 20, topLeftV: 20,
        topRightH: 20, topRightV: 20,
        bottomRightH: 20, bottomRightV: 20,
        bottomLeftH: 20, bottomLeftV: 20,
      })
    }
  }

  const getSliderMax = () => unit === '%' ? 100 : 200

  // Draggable handles on preview box
  const boxRef = useRef(null)
  const containerRef = useRef(null)
  const [dragging, setDragging] = useState(null)

  const handleMouseDown = useCallback((handle, e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(handle)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const boxRect = boxRef.current.getBoundingClientRect()
    
    // Calculate position relative to container
    const x = e.clientX - containerRect.left
    const y = e.clientY - containerRect.top
    
    // Box position within container
    const boxLeft = boxRect.left - containerRect.left
    const boxTop = boxRect.top - containerRect.top
    const boxRight = boxRect.right - containerRect.left
    const boxBottom = boxRect.bottom - containerRect.top
    const boxWidth = boxRect.width
    const boxHeight = boxRect.height

    const maxRadius = getSliderMax()

    if (mode === 'simple') {
      // Horizontal handles (top-left, top-right, bottom-right, bottom-left)
      if (dragging === 'topLeft') {
        const value = Math.min(Math.max(x - boxLeft, 0), maxRadius)
        setSimpleRadius(prev => ({ ...prev, topLeft: Math.round(value) }))
      } else if (dragging === 'topRight') {
        const value = Math.min(Math.max(boxRight - x, 0), maxRadius)
        setSimpleRadius(prev => ({ ...prev, topRight: Math.round(value) }))
      } else if (dragging === 'bottomRight') {
        const value = Math.min(Math.max(boxRight - x, 0), maxRadius)
        setSimpleRadius(prev => ({ ...prev, bottomRight: Math.round(value) }))
      } else if (dragging === 'bottomLeft') {
        const value = Math.min(Math.max(x - boxLeft, 0), maxRadius)
        setSimpleRadius(prev => ({ ...prev, bottomLeft: Math.round(value) }))
      }
    } else {
      // Advanced mode - horizontal and vertical handles
      if (dragging === 'topLeftH') {
        const value = Math.min(Math.max(x - boxLeft, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, topLeftH: Math.round(value) }))
      } else if (dragging === 'topLeftV') {
        const value = Math.min(Math.max(y - boxTop, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, topLeftV: Math.round(value) }))
      } else if (dragging === 'topRightH') {
        const value = Math.min(Math.max(boxRight - x, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, topRightH: Math.round(value) }))
      } else if (dragging === 'topRightV') {
        const value = Math.min(Math.max(y - boxTop, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, topRightV: Math.round(value) }))
      } else if (dragging === 'bottomRightH') {
        const value = Math.min(Math.max(boxRight - x, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, bottomRightH: Math.round(value) }))
      } else if (dragging === 'bottomRightV') {
        const value = Math.min(Math.max(boxBottom - y, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, bottomRightV: Math.round(value) }))
      } else if (dragging === 'bottomLeftH') {
        const value = Math.min(Math.max(x - boxLeft, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, bottomLeftH: Math.round(value) }))
      } else if (dragging === 'bottomLeftV') {
        const value = Math.min(Math.max(boxBottom - y, 0), maxRadius)
        setAdvancedRadius(prev => ({ ...prev, bottomLeftV: Math.round(value) }))
      }
    }
  }, [dragging, mode, unit])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const Slider = ({ label, value, onChange, min = 0, max = 200, unit = 'px', color = 'indigo' }) => {
    const colorClasses = {
      indigo: darkMode ? "accent-indigo-400" : "accent-indigo-600",
      purple: darkMode ? "accent-purple-400" : "accent-purple-600",
      pink: darkMode ? "accent-pink-400" : "accent-pink-600",
      blue: darkMode ? "accent-blue-400" : "accent-blue-600",
    }
    
    const step = unit === '%' ? 5 : 1
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>{label}</label>
          <span className={cn("text-sm font-mono", darkMode ? "text-gray-400" : "text-gray-500")}>{value}{unit}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={(e) => e.stopPropagation()}
          className={cn(
            "w-full h-2 rounded-lg appearance-none cursor-pointer",
            darkMode ? "bg-gray-700" : "bg-gray-200",
            colorClasses[color]
          )}
        />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className={cn("text-4xl font-bold", darkMode ? "text-white" : "text-gray-900")}>Border Radius Previewer</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                darkMode ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <p className={cn("text-center", darkMode ? "text-gray-400" : "text-gray-600")}>Visualize and customize CSS border-radius values</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto md:gap-6">
          {/* Preview Box */}
          <div className={cn("rounded-2xl shadow-lg p-6 md:p-8", darkMode ? "bg-gray-800" : "bg-white")}>
            <h2 className={cn("text-xl font-semibold mb-6", darkMode ? "text-white" : "text-gray-800")}>Preview</h2>
            <div 
              ref={containerRef}
              className={cn("flex items-center justify-center min-h-[300px] md:min-h-[400px] rounded-xl p-4 md:p-8 relative", darkMode ? "bg-gray-700" : "bg-gray-50")}
            >
              <div
                ref={boxRef}
                style={getBoxStyle()}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl transition-all duration-300 relative"
              >
                {/* Grid overlay */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none opacity-30">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}
                {/* CodePen-style handles */}
                {mode === 'simple' && (
                  <>
                    {/* Top Left Handle - moves along top edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-indigo-500 text-white" : "bg-white border-indigo-600 text-black"
                      )}
                      style={{ 
                        top: '-25px', 
                        left: `${simpleRadius.topLeft}${unit}`,
                        transform: 'translateX(-50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('topLeft', e)}
                    >
                      {simpleRadius.topLeft}
                    </div>
                    
                    {/* Top Right Handle - moves along top edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-600 text-black"
                      )}
                      style={{ 
                        top: '-25px', 
                        right: `${simpleRadius.topRight}${unit}`,
                        transform: 'translateX(50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('topRight', e)}
                    >
                      {simpleRadius.topRight}
                    </div>
                    
                    {/* Bottom Right Handle - moves along bottom edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-pink-500 text-white" : "bg-white border-pink-600 text-black"
                      )}
                      style={{ 
                        bottom: '-25px', 
                        right: `${simpleRadius.bottomRight}${unit}`,
                        transform: 'translateX(50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('bottomRight', e)}
                    >
                      {simpleRadius.bottomRight}
                    </div>
                    
                    {/* Bottom Left Handle - moves along bottom edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-blue-500 text-white" : "bg-white border-blue-600 text-black"
                      )}
                      style={{ 
                        bottom: '-25px', 
                        left: `${simpleRadius.bottomLeft}${unit}`,
                        transform: 'translateX(-50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('bottomLeft', e)}
                    >
                      {simpleRadius.bottomLeft}
                    </div>
                  </>
                )}

                {/* Advanced mode handles */}
                {mode === 'advanced' && (
                  <>
                    {/* Top Left - Horizontal - moves along top edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-indigo-500 text-white" : "bg-white border-indigo-600 text-black"
                      )}
                      style={{ 
                        top: '-25px', 
                        left: `${advancedRadius.topLeftH}${unit}`,
                        transform: 'translateX(-50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('topLeftH', e)}
                    >
                      {advancedRadius.topLeftH}
                    </div>
                    
                    {/* Top Left - Vertical - moves along left edge */}
                    <div
                      className={cn(
                        "absolute cursor-ns-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-indigo-500 text-white" : "bg-white border-indigo-600 text-black"
                      )}
                      style={{ 
                        top: `${advancedRadius.topLeftV}${unit}`,
                        left: '-35px',
                        transform: 'translateY(-50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('topLeftV', e)}
                    >
                      {advancedRadius.topLeftV}
                    </div>
                    
                    {/* Top Right - Horizontal - moves along top edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-600 text-black"
                      )}
                      style={{ 
                        top: '-25px', 
                        right: `${advancedRadius.topRightH}${unit}`,
                        transform: 'translateX(50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('topRightH', e)}
                    >
                      {advancedRadius.topRightH}
                    </div>
                    
                    {/* Top Right - Vertical - moves along right edge */}
                    <div
                      className={cn(
                        "absolute cursor-ns-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-600 text-black"
                      )}
                      style={{ 
                        top: `${advancedRadius.topRightV}${unit}`,
                        right: '-35px',
                        transform: 'translateY(-50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('topRightV', e)}
                    >
                      {advancedRadius.topRightV}
                    </div>
                    
                    {/* Bottom Right - Horizontal - moves along bottom edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-pink-500 text-white" : "bg-white border-pink-600 text-black"
                      )}
                      style={{ 
                        bottom: '-25px', 
                        right: `${advancedRadius.bottomRightH}${unit}`,
                        transform: 'translateX(50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('bottomRightH', e)}
                    >
                      {advancedRadius.bottomRightH}
                    </div>
                    
                    {/* Bottom Right - Vertical - moves along right edge */}
                    <div
                      className={cn(
                        "absolute cursor-ns-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-pink-500 text-white" : "bg-white border-pink-600 text-black"
                      )}
                      style={{ 
                        bottom: `${advancedRadius.bottomRightV}${unit}`,
                        right: '-35px',
                        transform: 'translateY(50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('bottomRightV', e)}
                    >
                      {advancedRadius.bottomRightV}
                    </div>
                    
                    {/* Bottom Left - Horizontal - moves along bottom edge */}
                    <div
                      className={cn(
                        "absolute cursor-ew-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-blue-500 text-white" : "bg-white border-blue-600 text-black"
                      )}
                      style={{ 
                        bottom: '-25px', 
                        left: `${advancedRadius.bottomLeftH}${unit}`,
                        transform: 'translateX(-50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('bottomLeftH', e)}
                    >
                      {advancedRadius.bottomLeftH}
                    </div>
                    
                    {/* Bottom Left - Vertical - moves along left edge */}
                    <div
                      className={cn(
                        "absolute cursor-ns-resize text-xs font-bold px-2 py-1 border-2 rounded select-none transition-transform hover:scale-105",
                        darkMode ? "bg-gray-800 border-blue-500 text-white" : "bg-white border-blue-600 text-black"
                      )}
                      style={{ 
                        bottom: `${advancedRadius.bottomLeftV}${unit}`,
                        left: '-35px',
                        transform: 'translateY(50%)'
                      }}
                      onMouseDown={(e) => handleMouseDown('bottomLeftV', e)}
                    >
                      {advancedRadius.bottomLeftV}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CSS Output */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>CSS Output</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className={cn("p-4 rounded-lg font-mono text-sm overflow-x-auto", darkMode ? "bg-gray-900 text-green-400" : "bg-gray-900 text-green-400")}>
                {getBorderRadiusCSS()}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className={cn("rounded-2xl shadow-lg p-6 md:p-8", darkMode ? "bg-gray-800" : "bg-white")}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn("text-xl font-semibold", darkMode ? "text-white" : "text-gray-800")}>Controls</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn(
                    "flex items-center gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm rounded-lg transition-colors",
                    showGrid 
                      ? "bg-indigo-600 text-white" 
                      : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  Grid
                </button>
                <button
                  onClick={resetValues}
                  className={cn(
                    "flex items-center gap-2 px-2 md:px-3 py-1.5 text-xs md:text-sm rounded-lg transition-colors",
                    darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Unit Toggle */}
            <div className={cn("flex gap-2 mb-6 p-1 rounded-lg", darkMode ? "bg-gray-700" : "bg-gray-100")}>
              <button
                onClick={() => setUnit('px')}
                className={cn(
                  'flex-1 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors',
                  unit === 'px'
                    ? darkMode ? 'bg-gray-600 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Pixels (px)
              </button>
              <button
                onClick={() => setUnit('%')}
                className={cn(
                  'flex-1 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors',
                  unit === '%'
                    ? darkMode ? 'bg-gray-600 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Percent (%)
              </button>
            </div>

            {/* Box Size Sliders */}
            <div className="mb-6 space-y-4">
              <Slider
                label="Box Width"
                value={boxWidth}
                onChange={setBoxWidth}
                min="100"
                max="300"
                unit="px"
                color="indigo"
              />
              <Slider
                label="Box Height"
                value={boxHeight}
                onChange={setBoxHeight}
                min="100"
                max="300"
                unit="px"
                color="purple"
              />
            </div>

            {/* Presets */}
            <div className="mb-6">
              <label className={cn("text-sm font-medium mb-2 block", darkMode ? "text-gray-300" : "text-gray-700")}>Presets</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={cn(
                      "px-2 md:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                      darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className={cn("flex gap-2 mb-6 p-1 rounded-lg", darkMode ? "bg-gray-700" : "bg-gray-100")}>
              <button
                onClick={() => setMode('simple')}
                className={cn(
                  'flex-1 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors',
                  mode === 'simple'
                    ? darkMode ? 'bg-gray-600 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Simple (4)
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={cn(
                  'flex-1 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors',
                  mode === 'advanced'
                    ? darkMode ? 'bg-gray-600 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Advanced (8)
              </button>
            </div>

            {/* Simple Mode Controls */}
            {mode === 'simple' && (
              <div className="space-y-6">
                <div className={cn("p-4 rounded-lg", darkMode ? "bg-indigo-900/30" : "bg-indigo-50")}>
                  <Slider
                    label="Top Left"
                    value={simpleRadius.topLeft}
                    onChange={(value) => setSimpleRadius({ ...simpleRadius, topLeft: value })}
                    max={getSliderMax()}
                    unit={unit}
                    color="indigo"
                  />
                </div>
                <div className={cn("p-4 rounded-lg", darkMode ? "bg-purple-900/30" : "bg-purple-50")}>
                  <Slider
                    label="Top Right"
                    value={simpleRadius.topRight}
                    onChange={(value) => setSimpleRadius({ ...simpleRadius, topRight: value })}
                    max={getSliderMax()}
                    unit={unit}
                    color="purple"
                  />
                </div>
                <div className={cn("p-4 rounded-lg", darkMode ? "bg-pink-900/30" : "bg-pink-50")}>
                  <Slider
                    label="Bottom Right"
                    value={simpleRadius.bottomRight}
                    onChange={(value) => setSimpleRadius({ ...simpleRadius, bottomRight: value })}
                    max={getSliderMax()}
                    unit={unit}
                    color="pink"
                  />
                </div>
                <div className={cn("p-4 rounded-lg", darkMode ? "bg-blue-900/30" : "bg-blue-50")}>
                  <Slider
                    label="Bottom Left"
                    value={simpleRadius.bottomLeft}
                    onChange={(value) => setSimpleRadius({ ...simpleRadius, bottomLeft: value })}
                    max={getSliderMax()}
                    unit={unit}
                    color="blue"
                  />
                </div>
              </div>
            )}

            {/* Advanced Mode Controls */}
            {mode === 'advanced' && (
              <div className="space-y-6">
                <div className={cn("p-4 rounded-lg", darkMode ? "bg-indigo-900/30" : "bg-indigo-50")}>
                  <h3 className={cn("text-sm font-semibold mb-4", darkMode ? "text-indigo-300" : "text-indigo-900")}>Top Left Corner</h3>
                  <div className="space-y-4">
                    <Slider
                      label="Horizontal"
                      value={advancedRadius.topLeftH}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, topLeftH: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                    <Slider
                      label="Vertical"
                      value={advancedRadius.topLeftV}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, topLeftV: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                  </div>
                </div>

                <div className={cn("p-4 rounded-lg", darkMode ? "bg-purple-900/30" : "bg-purple-50")}>
                  <h3 className={cn("text-sm font-semibold mb-4", darkMode ? "text-purple-300" : "text-purple-900")}>Top Right Corner</h3>
                  <div className="space-y-4">
                    <Slider
                      label="Horizontal"
                      value={advancedRadius.topRightH}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, topRightH: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                    <Slider
                      label="Vertical"
                      value={advancedRadius.topRightV}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, topRightV: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                  </div>
                </div>

                <div className={cn("p-4 rounded-lg", darkMode ? "bg-pink-900/30" : "bg-pink-50")}>
                  <h3 className={cn("text-sm font-semibold mb-4", darkMode ? "text-pink-300" : "text-pink-900")}>Bottom Right Corner</h3>
                  <div className="space-y-4">
                    <Slider
                      label="Horizontal"
                      value={advancedRadius.bottomRightH}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, bottomRightH: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                    <Slider
                      label="Vertical"
                      value={advancedRadius.bottomRightV}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, bottomRightV: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                  </div>
                </div>

                <div className={cn("p-4 rounded-lg", darkMode ? "bg-blue-900/30" : "bg-blue-50")}>
                  <h3 className={cn("text-sm font-semibold mb-4", darkMode ? "text-blue-300" : "text-blue-900")}>Bottom Left Corner</h3>
                  <div className="space-y-4">
                    <Slider
                      label="Horizontal"
                      value={advancedRadius.bottomLeftH}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, bottomLeftH: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                    <Slider
                      label="Vertical"
                      value={advancedRadius.bottomLeftV}
                      onChange={(value) => setAdvancedRadius({ ...advancedRadius, bottomLeftV: value })}
                      max={getSliderMax()}
                      unit={unit}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className={cn("text-center mt-12 text-sm", darkMode ? "text-gray-500" : "text-gray-500")}>
          <p>Built with React, TailwindCSS, and Vite</p>
        </footer>
      </div>
    </div>
  )
}

export default App
