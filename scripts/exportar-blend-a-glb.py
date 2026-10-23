# Exporta una COPIA de un .blend a .glb estático para el juego (pose actual, sin esqueleto ni
# animaciones, texturas de 2048 px como máximo). Así se prepararon Ekko y Vi en la v1.18.0.
# No modifica el .blend: Blender lo abre en modo fondo y no lo guarda.
#
# Uso (Windows):
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b copia.blend --python scripts\exportar-blend-a-glb.py -- salida.glb [materiales_a_quitar|-] [girar]
#   materiales_a_quitar: nombres separados por comas cuyas caras se eliminan de la copia (o «-»).
#   girar: gira el modelo 180° si en el juego aparece de espaldas.
#   Ejemplo: ... -- "%APPDATA%\Rifts & Gears - Las ciudades del Umbral\arte\modelos\nyra-quell.glb" - girar
import bpy, bmesh, sys
args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
quitar = set(args[1].split(',')) if len(args) > 1 and args[1] not in ('', '-') else set()
bpy.ops.object.mode_set(mode='OBJECT') if bpy.context.object and bpy.context.object.mode != 'OBJECT' else None
keep = []
for o in bpy.data.objects:
    o.select_set(False)
    if o.type != 'MESH' or o.name.startswith(('WGT-', 'Shape_')) or o.hide_render or not o.data.materials:
        continue
    keep.append(o)
for o in keep:
    if quitar:
        bm = bmesh.new(); bm.from_mesh(o.data)
        idx = {i for i, m in enumerate(o.data.materials) if m and m.name in quitar}
        bm.faces.ensure_lookup_table()
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.material_index in idx], context='FACES')
        bm.to_mesh(o.data); bm.free()
    o.select_set(True)
# Materiales simples que el visor del juego entiende: la imagen de color (_D, BaseColor, CO)
# va directa al color base, sin brillo de emisión ni mezclas de tinte, y la transparencia
# sale del canal alfa de esa misma imagen (pelo).
import re
COLOR = re.compile(r'(_d|basecolor|base_color|diffuse|albedo|_co|color)(.|$|s|.png|.jpe?g)', re.I)
for m in bpy.data.materials:
    if not m.use_nodes: continue
    nt = m.node_tree
    bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    salida_mat = next((n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'), None)
    if not bsdf or not salida_mat: continue
    tex = next((n for n in nt.nodes if n.type == 'TEX_IMAGE' and n.image and COLOR.search(n.image.name)), None)
    for l in list(nt.links):
        if l.to_node == bsdf and l.to_socket.name in ('Emission Color', 'Emission Strength', 'Alpha', 'Base Color'): nt.links.remove(l)
    if 'Emission Strength' in bsdf.inputs: bsdf.inputs['Emission Strength'].default_value = 0.0
    if tex:
        nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
        if 'hair' in m.name.lower() or 'pelo' in m.name.lower():
            nt.links.new(tex.outputs['Alpha'], bsdf.inputs['Alpha'])
    nt.links.new(bsdf.outputs['BSDF'], salida_mat.inputs['Surface'])
import math
if len(args) > 2 and args[2] == 'girar':
    for o in bpy.data.objects:
        if o.parent is None and o.type in ('MESH', 'ARMATURE', 'EMPTY'):
            o.matrix_world = __import__('mathutils').Matrix.Rotation(math.pi, 4, 'Z') @ o.matrix_world
# Texturas a un máximo de 2048 px para que el juego cargue rápido.
for img in bpy.data.images:
    if img.size[0] > 2048 or img.size[1] > 2048:
        k = 2048 / max(img.size)
        img.scale(int(img.size[0] * k), int(img.size[1] * k))
print('EXPORTANDO', [o.name for o in keep])
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_apply=True,
    export_skins=False, export_animations=False, export_morph=False, export_cameras=False, export_lights=False,
    export_image_format='AUTO', export_yup=True)
print('OK', out)
