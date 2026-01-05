import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, location } = await req.json();

    // Use Open-Meteo API (free, no API key required) - include daily forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/New_York&forecast_days=5`;

    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map weather codes to conditions
    const weatherCodeMap: Record<number, string> = {
      0: 'Clear Sky',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing Rime Fog',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      56: 'Light Freezing Drizzle',
      57: 'Dense Freezing Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      66: 'Light Freezing Rain',
      67: 'Heavy Freezing Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Slight Hail',
      99: 'Thunderstorm with Heavy Hail',
    };

    const currentWeatherCode = data.current?.weather_code || 0;
    const condition = weatherCodeMap[currentWeatherCode] || 'Unknown';

    // Format sunrise/sunset times
    const formatTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });
    };

    // Build forecast array
    const forecast = data.daily?.time?.slice(0, 5).map((date: string, index: number) => {
      const dayDate = new Date(date);
      return {
        day: dayDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/New_York' }),
        high: Math.round(data.daily.temperature_2m_max[index]),
        low: Math.round(data.daily.temperature_2m_min[index]),
        condition: weatherCodeMap[data.daily.weather_code[index]] || 'Unknown',
        weatherCode: data.daily.weather_code[index]
      };
    }) || [];

    const weather = {
      current: {
        temperature: Math.round(data.current?.temperature_2m || 0),
        feelsLike: Math.round(data.current?.apparent_temperature || 0),
        condition,
        humidity: data.current?.relative_humidity_2m,
        windSpeed: Math.round(data.current?.wind_speed_10m || 0),
      },
      today: {
        high: Math.round(data.daily?.temperature_2m_max?.[0] || 0),
        low: Math.round(data.daily?.temperature_2m_min?.[0] || 0),
        sunrise: data.daily?.sunrise?.[0] ? formatTime(data.daily.sunrise[0]) : null,
        sunset: data.daily?.sunset?.[0] ? formatTime(data.daily.sunset[0]) : null,
      },
      forecast,
      location: location || 'New York, NY',
    };

    return new Response(
      JSON.stringify({ weather }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch weather data',
        weather: {
          temperature: 45,
          condition: 'Partly Cloudy',
          location: 'New York, NY',
        }
      }),
      { 
        status: 200, // Return 200 with fallback data
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
