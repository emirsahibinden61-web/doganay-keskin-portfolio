import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const pythonScript = path.join(process.cwd(), 'sync_instagram.py');
    if (!fs.existsSync(pythonScript)) {
      return NextResponse.json(
        { success: false, message: 'Sync script not found' },
        { status: 404 }
      );
    }

    // Run python sync_instagram.py
    const { stdout, stderr } = await execPromise(`python "${pythonScript}"`, {
      timeout: 90000,
    });

    // Read updated site-content.json
    const siteContentPath = path.join(process.cwd(), 'data', 'site-content.json');
    let updatedInstagramReels = [];
    let updatedPersonalReels = [];
    if (fs.existsSync(siteContentPath)) {
      const data = JSON.parse(fs.readFileSync(siteContentPath, 'utf-8'));
      updatedInstagramReels = data.instagramReels || [];
      updatedPersonalReels = data.personalReels || [];
    }

    return NextResponse.json({
      success: true,
      message: `${updatedPersonalReels.length} adet @doganaykesking ve ${updatedInstagramReels.length} adet @keskinlermuzik Reels videosu başarıyla senkronize edildi!`,
      personalReels: updatedPersonalReels,
      instagramReels: updatedInstagramReels,
      output: stdout,
    });
  } catch (error: any) {
    console.error('Error syncing instagram reels:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Instagram senkronizasyonu sırasında hata oluştu: ' + (error?.message || error),
      },
      { status: 500 }
    );
  }
}
