package com.rider013.scheduler;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.widget.RemoteViews;

import java.util.Calendar;

public class RoutineWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Bitmap clockBitmap = createClockBitmap();

        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.routine_widget_layout);
            views.setImageViewBitmap(R.id.widget_clock_dial, clockBitmap);
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    private Bitmap createClockBitmap() {
        int width = 512;
        int height = 512;
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        float cx = width / 2f;
        float cy = height / 2f;
        float radius = Math.min(cx, cy) - 24f;

        // Dial Background Circle with 90% transparent / 10% opacity (alpha = 25 out of 255)
        Paint bgPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        bgPaint.setColor(Color.argb(25, 15, 23, 42)); // #0f172a with 10% opacity
        canvas.drawCircle(cx, cy, radius, bgPaint);

        // Outer Ring / Border (Circular shape definition)
        Paint borderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        borderPaint.setColor(Color.parseColor("#38bdf8")); // Sky blue accent
        borderPaint.setStyle(Paint.Style.STROKE);
        borderPaint.setStrokeWidth(10f);
        canvas.drawCircle(cx, cy, radius, borderPaint);

        // Hour Tick Marks & Numbers
        Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        textPaint.setColor(Color.parseColor("#ffffff"));
        textPaint.setTextSize(36f);
        textPaint.setTextAlign(Paint.Align.CENTER);
        textPaint.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);

        Paint tickPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        tickPaint.setColor(Color.parseColor("#cbd5e1"));
        tickPaint.setStrokeWidth(4f);

        for (int i = 0; i < 12; i++) {
            double angle = Math.toRadians(i * 30 - 90);
            float innerR = radius - 24f;
            float outerR = radius - 8f;
            float startX = (float) (cx + innerR * Math.cos(angle));
            float startY = (float) (cy + innerR * Math.sin(angle));
            float endX = (float) (cx + outerR * Math.cos(angle));
            float endY = (float) (cy + outerR * Math.sin(angle));
            canvas.drawLine(startX, startY, endX, endY, tickPaint);

            // Numbers 12, 3, 6, 9
            if (i % 3 == 0) {
                int num = i == 0 ? 12 : i;
                float numR = radius - 56f;
                float nx = (float) (cx + numR * Math.cos(angle));
                float ny = (float) (cy + numR * Math.sin(angle) + 12f);
                canvas.drawText(String.valueOf(num), nx, ny, textPaint);
            }
        }

        // Current Time
        Calendar cal = Calendar.getInstance();
        int hour = cal.get(Calendar.HOUR);
        int minute = cal.get(Calendar.MINUTE);

        // Hour Hand Angle
        float hourAngle = (hour + minute / 60.0f) * 30f;
        double hourRad = Math.toRadians(hourAngle - 90);
        float hourHandLen = radius * 0.5f;
        Paint hourPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        hourPaint.setColor(Color.parseColor("#38bdf8"));
        hourPaint.setStrokeWidth(12f);
        hourPaint.setStrokeCap(Paint.Cap.ROUND);
        canvas.drawLine(cx, cy, (float)(cx + hourHandLen * Math.cos(hourRad)), (float)(cy + hourHandLen * Math.sin(hourRad)), hourPaint);

        // Minute Hand Angle
        float minuteAngle = minute * 6f;
        double minuteRad = Math.toRadians(minuteAngle - 90);
        float minHandLen = radius * 0.75f;
        Paint minPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        minPaint.setColor(Color.parseColor("#ffffff"));
        minPaint.setStrokeWidth(8f);
        minPaint.setStrokeCap(Paint.Cap.ROUND);
        canvas.drawLine(cx, cy, (float)(cx + minHandLen * Math.cos(minuteRad)), (float)(cy + minHandLen * Math.sin(minuteRad)), minPaint);

        // Center Pivot Pin
        Paint pivotPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        pivotPaint.setColor(Color.parseColor("#ffffff"));
        canvas.drawCircle(cx, cy, 12f, pivotPaint);

        Paint pivotInnerPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        pivotInnerPaint.setColor(Color.parseColor("#38bdf8"));
        canvas.drawCircle(cx, cy, 6f, pivotInnerPaint);

        return bitmap;
    }
}
