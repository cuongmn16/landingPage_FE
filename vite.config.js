import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WISHES_STORE_PATH = path.resolve(__dirname, 'src/data/wishes_dev_store.json')

// Không gán lời chúc giả lập, chỉ lưu trữ những lời chúc thực tế người dùng gửi từ điện thoại/máy tính
const DEFAULT_WISHES = []

function getStoredWishes() {
  try {
    if (fs.existsSync(WISHES_STORE_PATH)) {
      const data = fs.readFileSync(WISHES_STORE_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('Error reading wishes dev store:', err)
  }
  return []
}

function saveStoredWishes(list) {
  try {
    const dir = path.dirname(WISHES_STORE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(WISHES_STORE_PATH, JSON.stringify(list, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error saving wishes dev store:', err)
  }
}

/**
 * Plugin đồng bộ lời chúc đa thiết bị trong môi trường Dev (Wi-Fi LAN / Local):
 * Khi điện thoại quét QR qua mạng Wi-Fi và gửi lời chúc -> Lập tức lưu vào máy tính
 * và truyền trực tiếp lên Màn hình lớn (Live Wishing Wall) trên laptop mà không cần backend/database!
 */
function wishesDevSyncPlugin() {
  return {
    name: 'ctin-wishes-dev-sync',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''

        // 1. Màn hình lớn lấy danh sách live: GET /api/wishes/live
        if (req.method === 'GET' && url === '/api/wishes/live') {
          const list = getStoredWishes()
          const visible = list.filter((w) => !w.isHidden)
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({
            status: 200,
            message: 'OK',
            data: {
              totalCount: visible.length,
              wishes: visible
            }
          }))
          return
        }

        // 2. Điện thoại gửi lời chúc mới qua mạng: POST /api/wishes
        if (req.method === 'POST' && url === '/api/wishes') {
          let bodyStr = ''
          req.on('data', (chunk) => {
            bodyStr += chunk
          })
          req.on('end', () => {
            try {
              const body = JSON.parse(bodyStr || '{}')
              const senderName = (body.senderName || '').trim()
              const unitName = (body.unitName || '').trim()
              const content = (body.content || '').trim()

              if (!senderName || !unitName || !content) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.end(JSON.stringify({ status: 400, message: 'Vui lòng điền đầy đủ họ tên, phòng ban và lời chúc' }))
                return
              }

              const newWish = {
                id: Date.now(),
                senderName,
                unitName,
                content,
                isHidden: false,
                createdAt: new Date().toISOString()
              }

              const list = getStoredWishes()
              list.unshift(newWish)
              saveStoredWishes(list)

              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({
                status: 200,
                message: 'Đã gửi lời chúc lên màn hình sự kiện!',
                data: newWish
              }))
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ status: 400, message: 'Định dạng dữ liệu không hợp lệ' }))
            }
          })
          return
        }

        // 3. Admin: Lấy toàn bộ lời chúc: GET /api/wishes/all
        if (req.method === 'GET' && url === '/api/wishes/all') {
          const list = getStoredWishes()
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ status: 200, data: list }))
          return
        }

        // 4. Admin: Ẩn / Hiện lời chúc: PUT /api/wishes/:id/hide
        if (req.method === 'PUT' && url.startsWith('/api/wishes/') && url.endsWith('/hide')) {
          const match = url.match(/\/api\/wishes\/(\d+)\/hide/)
          if (match) {
            const id = Number(match[1])
            const search = req.url.includes('?') ? req.url.split('?')[1] : ''
            const params = new URLSearchParams(search)
            const isHidden = params.get('hidden') !== 'false'

            const list = getStoredWishes()
            const found = list.find((w) => w.id === id)
            if (found) {
              found.isHidden = isHidden
              saveStoredWishes(list)
            }
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ status: 200, data: found }))
            return
          }
        }

        // 5. Admin: Xóa lời chúc: DELETE /api/wishes/:id
        if (req.method === 'DELETE' && url.startsWith('/api/wishes/')) {
          const match = url.match(/\/api\/wishes\/(\d+)/)
          if (match) {
            const id = Number(match[1])
            let list = getStoredWishes()
            list = list.filter((w) => w.id !== id)
            saveStoredWishes(list)
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ status: 200, message: 'Đã xóa' }))
            return
          }
        }

        // 6. Danh sách phòng ban: GET /api/units
        if (req.method === 'GET' && (url === '/api/units' || url === '/api/units/')) {
          const defaultUnits = [
            'Ban Lãnh đạo',
            'Ban Kế hoạch tổng hợp',
            'Ban Kinh doanh',
            'Ban Tài chính',
            'Ban Nhân lực',
            'Trung tâm Triển khai',
            'Trung tâm Tư vấn giải pháp',
            'Ban Quản lý dự án',
            'Văn phòng Hà Nội',
            'Văn phòng Đà Nẵng',
            'Văn phòng Hồ Chí Minh',
            'BU Vietlott',
            'Khách quý / Đối tác'
          ].map((name, i) => ({ id: i + 1, name, unitName: name, sortOrder: i + 1 }))

          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ status: 200, data: defaultUnits }))
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wishesDevSyncPlugin()],
  server: {
    host: true, // Mở mạng 0.0.0.0 để điện thoại cùng Wi-Fi quét và truy cập được qua IP máy tính
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://localhost:3000'
        }
      }
    }
  }
})
