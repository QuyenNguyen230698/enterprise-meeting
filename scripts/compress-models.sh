#!/bin/bash

# Compress all model files > 20MB

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
MODELS_DIR="${PROJECT_DIR}/public/models"
MAX_SIZE_MB=20
MAX_SIZE_BYTES=$((MAX_SIZE_MB * 1024 * 1024))

echo "🗜️  Compressing models > ${MAX_SIZE_MB}MB..."
echo "📁 Models: $MODELS_DIR"
echo ""

# Restore USDZ from backup if missing
if [ ! -f "${MODELS_DIR}/base_basic_pbr.usdz" ] && [ -f "${MODELS_DIR}/base_basic_pbr_backup.usdz" ]; then
    echo "📦 Restoring USDZ from backup..."
    cp "${MODELS_DIR}/base_basic_pbr_backup.usdz" "${MODELS_DIR}/base_basic_pbr.usdz"
    cp "${MODELS_DIR}/base_basic_pbr_2_backup.usdz" "${MODELS_DIR}/base_basic_pbr_2.usdz"
fi

# Compress GLB
compress_glb() {
    local file="$1"
    local size=$(stat -f%z "$file")
    
    if [ "$size" -gt "$MAX_SIZE_BYTES" ]; then
        echo "📦 GLB: $(basename "$file") ($(echo "scale=1; $size/1024/1024" | bc)MB)..."
        local output="${file%.glb}_new.glb"
        npx -y @gltf-transform/cli optimize "$file" "$output" --texture-compress webp --texture-size 1024
        mv "$output" "$file"
        echo "  ✓ $(ls -lh "$file" | awk '{print $5}')"
    else
        echo "✓ GLB: $(basename "$file") OK ($(echo "scale=1; $size/1024/1024" | bc)MB)"
    fi
}

# Compress USDZ
compress_usdz() {
    local file="$1"
    local size=$(stat -f%z "$file")
    
    if [ "$size" -gt "$MAX_SIZE_BYTES" ]; then
        echo "📦 USDZ: $(basename "$file") ($(echo "scale=1; $size/1024/1024" | bc)MB)..."
        local temp_dir="/tmp/usdz_$$"
        local output="${file%.usdz}_new.usdz"
        
        rm -rf "$temp_dir" && mkdir -p "$temp_dir"
        unzip -q "$file" -d "$temp_dir"
        
        # Resize textures
        find "$temp_dir" -name "*.png" -exec sips -Z 512 {} --out {} \; >/dev/null 2>&1
        
        # Repack with absolute path
        (cd "$temp_dir" && zip -9 -r -q "${output}" .)
        rm -rf "$temp_dir"
        
        mv "${output}" "$file"
        echo "  ✓ $(ls -lh "$file" | awk '{print $5}')"
    else
        echo "✓ USDZ: $(basename "$file") OK ($(echo "scale=1; $size/1024/1024" | bc)MB)"
    fi
}

# Process GLB
for f in "${MODELS_DIR}"/base_basic_pbr*.glb; do
    [[ ! "$f" =~ backup ]] && compress_glb "$f"
done

echo ""

# Process USDZ
for f in "${MODELS_DIR}"/base_basic_pbr*.usdz; do
    [[ ! "$f" =~ backup ]] && compress_usdz "$f"
done

# Cleanup
echo ""
echo "🗑️  Cleaning backups..."
rm -f "${MODELS_DIR}"/*_backup.*

echo ""
echo "📊 Final:"
ls -lh "${MODELS_DIR}"/*.glb "${MODELS_DIR}"/*.usdz 2>/dev/null
echo "Total: $(du -sh "${MODELS_DIR}" | awk '{print $1}')"
echo "🎉 Done!"
